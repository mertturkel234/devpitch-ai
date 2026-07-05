# DevPitch.ai

GitHub profilinizi ve hedef iş ilanını analiz eden yapay zeka, yurt dışı şirketlere gönderilecek profesyonel bir cover letter (ön yazı) hazırlar.

## Özellikler
- GitHub repolarının ve LinkedIn PDF geçmişinin analiz edilmesi.
- OpenAI GPT-4o-mini entegrasyonu.
- Stripe ile Kredi tabanlı abonelik ve tek seferlik ödeme altyapısı.
- Kanban Board ile iş başvurularını sürükle-bırak ile takip edebilme.
- TipTap editörü ve "Modern/Klasik/Yaratıcı" mektup şablonları.
- Uluslararasılaştırma (i18n) desteği (Türkçe, İngilizce).
- next-themes ile Aydınlık / Karanlık Mod desteği.

## Geliştirme (Local)

1. Depoyu klonlayın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. `.env.local` dosyasını oluşturun ve gerekli değişkenleri ekleyin (aşağıya bakın).

3. Veritabanını oluşturun:
   ```bash
   npx prisma db push
   ```

4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## Vercel Deployment

Uygulamayı Vercel üzerinde yayına almak için aşağıdaki environment variable'ların tamamının ayarlanması gerekmektedir:

### Environment Variables

| Değişken Adı | Açıklama |
| --- | --- |
| `DATABASE_URL` | Prisma için veritabanı URL'si (Production için PostgreSQL veya PlanetScale önerilir, şu an SQLite kullanılıyor. Vercel'e deploy için Neon/Supabase PostgreSQL URL'si alıp `schema.prisma`'yı `postgresql` olarak güncellemeniz gerekebilir.) |
| `NEXTAUTH_URL` | Uygulamanızın yayınlandığı URL (Örn: `https://devpitch.ai`) |
| `NEXTAUTH_SECRET` | Rastgele oluşturulmuş bir secret key. (Örn: `openssl rand -base64 32` ile üretebilirsiniz) |
| `GITHUB_ID` | GitHub OAuth uygulamanızın Client ID'si |
| `GITHUB_SECRET` | GitHub OAuth uygulamanızın Client Secret'ı |
| `OPENAI_API_KEY` | OpenAI API anahtarınız (gpt-4o-mini erişimi olmalı) |
| `STRIPE_SECRET_KEY` | Stripe gizli anahtarınız (`sk_test_...` veya `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook imza anahtarınız (`whsec_...`) |
| `NEXT_PUBLIC_APP_URL` | Stripe başarılı ödeme sonrası dönüş URL'si için (Örn: `https://devpitch.ai`) |

### Vercel'de Dikkat Edilmesi Gerekenler
- Projenin şu anki veritabanı sağlayıcısı **SQLite**'tır (`prisma/schema.prisma`).
- SQLite, sunucusuz (serverless) ortamlarda kalıcı bir dosya sistemi gerektirdiğinden, Vercel'e atarken veriler sıfırlanabilir veya çalışmayabilir.
- Yayına almadan önce Prisma şemasında provider'ı `"postgresql"` olarak değiştirip, [Neon](https://neon.tech/) veya [Supabase](https://supabase.com/) gibi ücretsiz bir PostgreSQL veritabanı bağlamanız önerilir.

## Lisans
MIT
