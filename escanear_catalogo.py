"""
escanear_catalogo.py
====================
Escanea recursivamente `public/assets/Catalogo3D` en busca de carpetas e imágenes
(webp, png, jpg, jpeg), detecta cuáles están ausentes o desincronizadas en
`src/modulos/Catalogo3D/datos/catalogoFiguras.json` y permite registrar o actualizar
las entradas automáticamente.

Uso:
    python escanear_catalogo.py [--dry-run] [--auto]
"""

import os
import sys
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / "public" / "assets" / "Catalogo3D"
JSON_PATH = BASE_DIR / "src" / "modulos" / "Catalogo3D" / "datos" / "catalogoFiguras.json"

EXTENSIONES_VALIDAS = {".webp", ".png", ".jpg", ".jpeg"}

def normalizar_slug(texto: str) -> str:
    texto = texto.lower()
    reemplazos = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u", "ñ": "n",
        " ": "-", "_": "-"
    }
    for orig, rep in reemplazos.items():
        texto = texto.replace(orig, rep)
    texto = re.sub(r"[^a-z0-9\-]", "", texto)
    return re.sub(r"-+", "-", texto).strip("-")

def formatear_nombre_carpeta(nombre_carpeta: str) -> str:
    partes = nombre_carpeta.replace("-", " ").replace("_", " ").split()
    return " ".join(p.capitalize() for p in partes)

def cargar_catalogo():
    if not JSON_PATH.exists():
        return []
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def guardar_catalogo(catalogo):
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(catalogo, f, ensure_ascii=False, indent=2)
        f.write("\n")

def escanear_disco():
    """Devuelve un diccionario {nombre_carpeta: [rutas_relativas_web]}"""
    resultado = {}
    if not ASSETS_DIR.exists():
        return resultado

    for entrada in sorted(ASSETS_DIR.iterdir()):
        if entrada.is_dir():
            imagenes = []
            for archivo in sorted(entrada.iterdir()):
                if archivo.is_file() and archivo.suffix.lower() in EXTENSIONES_VALIDAS:
                    # Ruta web que usa React: /assets/Catalogo3D/carpeta/archivo.webp
                    ruta_web = f"/assets/Catalogo3D/{entrada.name}/{archivo.name}"
                    imagenes.append((archivo.name, ruta_web))
            if imagenes:
                resultado[entrada.name] = imagenes
    return resultado

def analizar_diferencias(catalogo, disco):
    # Indexar rutas existentes en el JSON
    rutas_en_json = set()
    carpetas_en_json = set()

    for item in catalogo:
        for img in item.get("galeriaImagenes", []):
            url = img.get("urlImagen", "")
            rutas_en_json.add(url)
            partes = url.strip("/").split("/")
            if len(partes) >= 3 and partes[1] == "Catalogo3D":
                carpetas_en_json.add(partes[2])

    carpetas_nuevas = {}
    imagenes_nuevas_en_carpetas_existentes = {}

    for carpeta, imgs in disco.items():
        if carpeta not in carpetas_en_json:
            carpetas_nuevas[carpeta] = imgs
        else:
            faltantes = [img for img in imgs if img[1] not in rutas_en_json]
            if faltantes:
                imagenes_nuevas_en_carpetas_existentes[carpeta] = faltantes

    return carpetas_nuevas, imagenes_nuevas_en_carpetas_existentes, rutas_en_json

def generar_nueva_figura(carpeta: str, imagenes: list, siguiente_numero: int):
    id_figura = f"fig-{siguiente_numero:02d}"
    nombre_limpio = formatear_nombre_carpeta(carpeta)
    
    galeria = []
    for idx, (nombre_archivo, ruta_web) in enumerate(imagenes, 1):
        sufijo_letra = chr(ord('a') + (idx - 1) % 26)
        galeria.append({
            "idImagen": f"img-{siguiente_numero:02d}-{sufijo_letra}",
            "tituloVista": f"{nombre_limpio} · Vista {idx}",
            "urlImagen": ruta_web
        })

    variantes = []
    if len(galeria) > 1:
        variantes.append({
            "idVariante": f"var-{normalizar_slug(carpeta)}-pack",
            "nombre": f"Pack Completo {nombre_limpio}",
            "precio": 12.0,
            "idImagenAsociada": galeria[0]["idImagen"],
            "detalle": "Set completo con todas las piezas ilustradas"
        })
        variantes.append({
            "idVariante": f"var-{normalizar_slug(carpeta)}-unidad",
            "nombre": f"1 Ud. · {nombre_limpio} Individual",
            "precio": 5.0,
            "idImagenAsociada": galeria[1]["idImagen"] if len(galeria) > 1 else galeria[0]["idImagen"],
            "detalle": "Pieza individual"
        })
    else:
        variantes.append({
            "idVariante": f"var-{normalizar_slug(carpeta)}-unidad",
            "nombre": f"{nombre_limpio} (1 Unidad)",
            "precio": 8.0,
            "idImagenAsociada": galeria[0]["idImagen"],
            "detalle": "Pieza física terminada en impresión 3D"
        })

    return {
        "id": id_figura,
        "nombre": nombre_limpio,
        "resumenCortoTarjeta": f"Figura decorativa artesanal de {nombre_limpio}.",
        "textoDisponibilidadTarjeta": "Opción de chip NFC integrado",
        "categoria": "Colección Impresión 3D",
        "precioReferenciaEuros": variantes[0]["precio"],
        "disponibleEnStock": True,
        "unidadesDisponibles": 5,
        "descripcion": f"Diseño de alta definición impreso en PLA/PLA+ con opción de incorporar chip NFC en su base para activación táctil con smartphones.",
        "galeriaImagenes": galeria,
        "variantes": variantes,
        "opcionNFC": {
            "disponible": True,
            "precioExtra": 3.0,
            "etiqueta": "Agregar Chip NFC Inteligente",
            "descripcion": "Integramos un chip NFC oculto en la base para vincular enlaces, WiFi o perfiles al aproximar el teléfono móvil."
        },
        "coloresDisponibles": [
            "Blanco Hueso (PLA+)",
            "Negro Mate (PLA)"
        ]
    }

def main():
    if sys.platform.startswith("win"):
        try:
            sys.stdout.reconfigure(encoding="utf-8")
            sys.stderr.reconfigure(encoding="utf-8")
        except Exception:
            pass
    dry_run = "--dry-run" in sys.argv
    catalogo = cargar_catalogo()
    disco = escanear_disco()

    print("=" * 65)
    print("🔍 AUDITOR Y SINCRONIZADOR DE CATÁLOGO 3D")
    print(f"Ruta de búsqueda: {ASSETS_DIR}")
    print(f"Destino JSON:    {JSON_PATH}")
    print("=" * 65)

    carpetas_nuevas, imgs_faltantes, rutas_existentes = analizar_diferencias(catalogo, disco)

    total_carpetas_disco = len(disco)
    total_items_json = len(catalogo)
    print(f"📦 Carpetas en disco: {total_carpetas_disco} | Artículos en JSON: {total_items_json}")

    cambios_realizados = False

    # 1. Nuevas carpetas detectadas
    if carpetas_nuevas:
        print(f"\n✨ Se han detectado {len(carpetas_nuevas)} nueva(s) carpeta(s) con imágenes:")
        for carpeta, imgs in carpetas_nuevas.items():
            print(f"  📁 {carpeta} ({len(imgs)} imágenes)")

        # Calcular el siguiente ID numérico
        numeros_id = []
        for item in catalogo:
            m = re.search(r"fig-(\d+)", item.get("id", ""))
            if m:
                numeros_id.append(int(m.group(1)))
        siguiente_num = max(numeros_id, default=0) + 1

        for carpeta, imgs in carpetas_nuevas.items():
            nueva_figura = generar_nueva_figura(carpeta, imgs, siguiente_num)
            siguiente_num += 1
            catalogo.append(nueva_figura)
            cambios_realizados = True
            print(f"     -> Creada entrada '{nueva_figura['nombre']}' con ID {nueva_figura['id']}")
    else:
        print("\n✅ Todas las carpetas de disco ya están registradas en el catálogo.")

    # 2. Nuevas imágenes en carpetas ya existentes
    if imgs_faltantes:
        print(f"\n🖼️  Nuevas imágenes en productos existentes:")
        for carpeta, imgs in imgs_faltantes.items():
            print(f"  📂 {carpeta}: +{len(imgs)} imagen(es) no vinculada(s)")
            # Buscar el item en catalogo
            for item in catalogo:
                primer_url = item.get("galeriaImagenes", [{}])[0].get("urlImagen", "")
                if f"/{carpeta}/" in primer_url:
                    num_str = re.search(r"fig-(\d+)", item.get("id", "fig-01"))
                    num_val = int(num_str.group(1)) if num_str else 1
                    len_actual = len(item.get("galeriaImagenes", []))
                    for offset, (nom, r_web) in enumerate(imgs, 1):
                        letra = chr(ord('a') + (len_actual + offset - 1) % 26)
                        item.setdefault("galeriaImagenes", []).append({
                            "idImagen": f"img-{num_val:02d}-{letra}",
                            "tituloVista": f"{item['nombre']} · {nom.replace('.webp', '')}",
                            "urlImagen": r_web
                        })
                    cambios_realizados = True
                    print(f"     -> Añadidas {len(imgs)} fotos a '{item['nombre']}'")
                    break

    if cambios_realizados:
        if dry_run:
            print("\n[DRY-RUN] Modo simulación activado. No se escribieron cambios en el JSON.")
        else:
            guardar_catalogo(catalogo)
            print(f"\n💾 ¡Éxito! `catalogoFiguras.json` ha sido actualizado correctamente.")
    else:
        print("\n🎉 El catálogo JSON y la carpeta de assets están 100% sincronizados. No hacen falta cambios.")

if __name__ == "__main__":
    main()
