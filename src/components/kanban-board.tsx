"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { updateApplicationStatus } from "@/app/actions/kanban";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoverLetterCard } from "@/components/cover-letter-card";

export type ApplicationWithLetter = {
  id: string;
  companyName: string;
  jobTitle: string;
  status: string;
  createdAt: Date;
  coverLetter?: {
    id: string;
    content: string;
    jobPost: string;
  } | null;
};

const COLUMNS = [
  { id: "APPLIED", title: "Başvuruldu" },
  { id: "INTERVIEW", title: "Mülakat" },
  { id: "OFFER", title: "Teklif Alındı" },
  { id: "REJECTED", title: "Reddedildi" },
];

export function KanbanBoard({ initialApplications }: { initialApplications: ApplicationWithLetter[] }) {
  const [columns, setColumns] = useState<Record<string, ApplicationWithLetter[]>>({
    APPLIED: [],
    INTERVIEW: [],
    OFFER: [],
    REJECTED: [],
  });
  
  const [selectedLetter, setSelectedLetter] = useState<{content: string; jobPost: string} | null>(null);

  // Initialize columns correctly handling hydration
  useEffect(() => {
    const cols: Record<string, ApplicationWithLetter[]> = {
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      REJECTED: [],
    };

    initialApplications.forEach((app) => {
      const status = app.status;
      if (cols[status]) {
        cols[status].push(app);
      } else {
        cols["APPLIED"].push(app); // fallback
      }
    });

    setColumns(cols);
  }, [initialApplications]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    const sourceList = Array.from(columns[sourceColId]);
    const destList = Array.from(columns[destColId]);
    
    // Optimistic UI update
    const [movedApp] = sourceList.splice(source.index, 1);
    
    if (sourceColId === destColId) {
      sourceList.splice(destination.index, 0, movedApp);
      setColumns({ ...columns, [sourceColId]: sourceList });
    } else {
      movedApp.status = destColId;
      destList.splice(destination.index, 0, movedApp);
      setColumns({
        ...columns,
        [sourceColId]: sourceList,
        [destColId]: destList,
      });
      
      // Update in DB
      const res = await updateApplicationStatus(draggableId, destColId);
      if (!res.success) {
        toast.error("Durum güncellenirken bir hata oluştu.");
        // Revert UI (simplistic fallback, full reload might be better in real world)
      } else {
        toast.success("Başvuru durumu güncellendi.");
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
          {COLUMNS.map((col) => (
            <div key={col.id} className="min-w-[300px] flex-1 bg-surface/50 rounded-xl p-4 snap-center border border-border-subtle/50 flex flex-col h-[calc(100vh-250px)]">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-semibold text-foreground">{col.title}</h3>
                <Badge variant="secondary" className="font-mono text-xs">
                  {columns[col.id]?.length || 0}
                </Badge>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 overflow-y-auto min-h-[150px] transition-colors rounded-lg p-2 -mx-2 space-y-3 ${
                      snapshot.isDraggingOver ? "bg-accent/5" : ""
                    }`}
                  >
                    {columns[col.id]?.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-4 shadow-sm border border-border-subtle hover:border-accent/30 transition-all ${
                              snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : ""
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-foreground text-sm line-clamp-1 flex-1 pr-2" title={app.jobTitle}>
                                {app.jobTitle}
                              </h4>
                            </div>
                            
                            <div className="flex items-center gap-1.5 text-xs text-muted mb-3">
                              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                              <span className="truncate">{app.companyName}</span>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                                <Calendar className="w-3 h-3" />
                                {new Date(app.createdAt).toLocaleDateString("tr-TR")}
                              </div>
                              
                              {app.coverLetter && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedLetter({ 
                                    content: app.coverLetter!.content, 
                                    jobPost: app.coverLetter!.jobPost 
                                  })}
                                  className="text-xs flex items-center gap-1 text-accent hover:underline"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  Mektup
                                </button>
                              )}
                            </div>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={!!selectedLetter} onOpenChange={(open) => !open && setSelectedLetter(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cover Letter Görüntüle</DialogTitle>
          </DialogHeader>
          {selectedLetter && (
            <div className="mt-4 space-y-4">
              <div className="text-sm text-muted bg-surface p-3 rounded-lg border border-border-subtle max-h-32 overflow-y-auto">
                <span className="font-medium text-foreground">İş İlanı:</span>
                <p className="mt-1 whitespace-pre-wrap">{selectedLetter.jobPost}</p>
              </div>
              <CoverLetterCard content={selectedLetter.content} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
