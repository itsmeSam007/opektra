import io
from pathlib import Path


def optimize_upload(data: bytes, content_type: str, original_ext: str) -> tuple[bytes, str, str]:
    """Convert raster images to WebP; pass through PDF and unsupported types."""
    if content_type == "application/pdf":
        return data, content_type, original_ext or ".pdf"
    if not content_type.startswith("image/") or content_type in ("image/gif", "image/svg+xml"):
        return data, content_type, original_ext or ".bin"

    try:
        from PIL import Image

        img = Image.open(io.BytesIO(data))
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="WEBP", quality=85, method=4)
        return buf.getvalue(), "image/webp", ".webp"
    except Exception:
        return data, content_type, original_ext or ".bin"
