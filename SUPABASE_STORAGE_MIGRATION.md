# Migração: Vercel Blob → Supabase Storage

Este guia mostra como migrar do Vercel Blob para o Supabase Storage.

## 1. Configurar Supabase Storage

### No Dashboard do Supabase:

1. Acesse seu projeto no Supabase
2. Vá para "Storage" no menu lateral
3. Clique em "Create a new bucket"
4. Configure:
   - **Name**: `marketing-content`
   - **Public bucket**: ✓ (marcado)
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`

## 2. Atualizar o Código

### Criar novo arquivo para upload com Supabase:

```typescript
// app/api/upload-image-supabase/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ success: false, error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size must be less than 5MB" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split(".").pop() || "jpg"
    const filename = `${timestamp}-${randomString}.${fileExtension}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("marketing-content")
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false
      })

    if (error) {
      console.error("Supabase Storage error:", error)
      return NextResponse.json(
        {
          success: false,
          error: `Upload failed: ${error.message}`,
        },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("marketing-content")
      .getPublicUrl(filename)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
    })
  } catch (error: any) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Server error: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    )
  }
}
```

## 3. Atualizar o Frontend

Substitua as chamadas para `/api/upload-image` por `/api/upload-image-supabase`:

```typescript
// Exemplo de uso no frontend
const uploadImage = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload-image-supabase", {
    method: "POST",
    body: formData,
  })

  return response.json()
}
```

## 4. Políticas de Segurança (RLS)

Para maior segurança, configure políticas RLS no Supabase:

```sql
-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketing-content');

-- Permitir leitura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'marketing-content');

-- Permitir delete apenas para o proprietário
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
```

## 5. Migrar Imagens Existentes

Script para migrar imagens do Vercel Blob para Supabase:

```javascript
// scripts/migrate-images.js
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function migrateImages() {
  // 1. Listar todas as URLs de imagens do banco de dados
  // 2. Para cada URL do Vercel Blob:
  //    - Fazer download da imagem
  //    - Upload para Supabase Storage
  //    - Atualizar URL no banco de dados
  
  console.log('Migration completed!')
}

migrateImages()
```

## 6. Vantagens do Supabase Storage

- **Integração**: Já está usando Supabase para o banco
- **Custo**: 1GB grátis no plano free
- **Performance**: CDN global incluído
- **Segurança**: Políticas RLS integradas
- **Transformações**: Redimensionamento de imagens on-the-fly

## 7. Limites e Preços

### Plano Gratuito
- 1GB de armazenamento
- 2GB de largura de banda/mês
- Uploads de até 50MB

### Plano Pro ($25/mês)
- 100GB de armazenamento
- 200GB de largura de banda/mês
- Uploads de até 5GB

## 8. Remover Dependência do Vercel Blob

Após migrar tudo:

```bash
npm uninstall @vercel/blob
```

E remova a variável de ambiente `BLOB_READ_WRITE_TOKEN`.