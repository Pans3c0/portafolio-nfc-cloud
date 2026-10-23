/**
 * @file actualizarMetadatosSEO.ts
 * @description Utilidad para actualizar dinámicamente `<title>`, `<meta name="description">`,
 * etiquetas Open Graph y datos estructurados JSON-LD (`Schema.org`) en cada módulo de la SPA.
 *
 * MENTORING JUNIOR - SEO LOCAL Y RICH SNIPPETS EN SPA:
 * Además del título y la descripción, inyectar un bloque `<script type="application/ld+json">`
 * permite que Google identifique el negocio local (Restaurante, Peluquería o Tienda), su
 * dirección física (ej: C. Cataluña 54, Gijón), su teléfono (+34 648 85 56 79) y su valoración
 * media (4.9 ★ con 433 reseñas).
 */

export interface MetadatosPaginaSEO {
  tituloPagina: string;
  descripcionMeta: string;
  jsonLdSchema?: Record<string, unknown>;
}

export function actualizarMetadatosSEO({
  tituloPagina,
  descripcionMeta,
  jsonLdSchema
}: MetadatosPaginaSEO): void {
  document.title = tituloPagina;

  let etiquetaDescripcion = document.querySelector<HTMLMetaElement>(
    'meta[name="description"]'
  );

  if (!etiquetaDescripcion) {
    etiquetaDescripcion = document.createElement('meta');
    etiquetaDescripcion.name = 'description';
    document.head.appendChild(etiquetaDescripcion);
  }

  etiquetaDescripcion.content = descripcionMeta;

  const idScriptJsonLd = 'schema-org-jsonld-dinamico';
  let scriptExistente = document.getElementById(
    idScriptJsonLd
  ) as HTMLScriptElement | null;

  if (jsonLdSchema) {
    if (!scriptExistente) {
      scriptExistente = document.createElement('script');
      scriptExistente.id = idScriptJsonLd;
      scriptExistente.type = 'application/ld+json';
      document.head.appendChild(scriptExistente);
    }
    scriptExistente.textContent = JSON.stringify(jsonLdSchema);
  } else if (scriptExistente) {
    scriptExistente.remove();
  }
}
