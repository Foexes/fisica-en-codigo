from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


PROJECT_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIRECTORY = PROJECT_ROOT / "public"
FONT_CANDIDATES = [
    Path("C:/Windows/Fonts/georgiai.ttf"),
    Path("C:/Windows/Fonts/georgia.ttf"),
]


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for font_path in FONT_CANDIDATES:
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size=size)
    return ImageFont.load_default(size=size)


def create_icon(size: int, maskable: bool = False) -> Image.Image:
    image = Image.new("RGB", (size, size), "#101814")
    draw = ImageDraw.Draw(image)
    padding_ratio = 0.18 if maskable else 0.11
    padding = round(size * padding_ratio)
    corner_radius = round(size * (0.19 if maskable else 0.22))

    draw.rounded_rectangle(
        (padding, padding, size - padding, size - padding),
        radius=corner_radius,
        fill="#64E5A8",
    )

    font = load_font(round(size * (0.52 if maskable else 0.58)))
    glyph = "ƒ"
    bounds = draw.textbbox((0, 0), glyph, font=font)
    glyph_width = bounds[2] - bounds[0]
    glyph_height = bounds[3] - bounds[1]
    x = (size - glyph_width) / 2 - bounds[0]
    y = (size - glyph_height) / 2 - bounds[1] - size * 0.025
    draw.text((x, y), glyph, font=font, fill="#08271A")
    return image


def main() -> None:
    PUBLIC_DIRECTORY.mkdir(parents=True, exist_ok=True)
    create_icon(64).save(PUBLIC_DIRECTORY / "favicon.png", optimize=True)
    create_icon(192).save(PUBLIC_DIRECTORY / "icon-192.png", optimize=True)
    create_icon(512).save(PUBLIC_DIRECTORY / "icon-512.png", optimize=True)
    create_icon(512, maskable=True).save(
        PUBLIC_DIRECTORY / "maskable-icon-512.png",
        optimize=True,
    )


if __name__ == "__main__":
    main()
