#!/usr/bin/env python3
"""
🎨 PWA ICON GENERATOR – Školní Rozvrh
Generuje všechny potřebné PNG ikony pro PWA
Autoři: Více Adm. Jiřík 🚀 & Adm. Claude 🤖
"""

import os

try:
    from PIL import Image, ImageDraw, ImageFont
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

# Velikosti ikon pro PWA
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
OUTPUT_DIR = "icons"

def create_icon_svg_style(size):
    """Vytvoří ikonu v cyan/dark stylu aplikace"""
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Pozadí - tmavý gradient efekt (přibližný s PIL)
    # Vrstva 1 - tmavé pozadí
    draw.ellipse([0, 0, size, size], fill=(15, 12, 41, 255))
    
    # Vrstva 2 - mírně světlejší střed
    margin = size // 8
    draw.ellipse([margin, margin, size - margin, size - margin], 
                  fill=(24, 20, 60, 255))
    
    # Rámeček (cyan)
    border = size // 16
    draw.ellipse([border, border, size - border, size - border],
                  outline=(0, 255, 255, 200), width=max(2, size // 32))
    
    # Text / Symbol
    center = size // 2
    
    # Hodiny symbol – kružnice
    clock_r = size // 4
    clock_x = center
    clock_y = center - size // 12
    
    draw.ellipse([clock_x - clock_r, clock_y - clock_r,
                   clock_x + clock_r, clock_y + clock_r],
                  outline=(0, 255, 255, 220), width=max(2, size // 40))
    
    # Ručičky hodin
    # Hodinová ručička (kratší)
    h_len = clock_r * 0.55
    draw.line([clock_x, clock_y, clock_x + 1, clock_y - int(h_len)],
               fill=(0, 255, 255, 255), width=max(2, size // 48))
    
    # Minutová ručička (delší)
    m_len = clock_r * 0.8
    draw.line([clock_x, clock_y, clock_x + int(m_len * 0.7), clock_y],
               fill=(0, 255, 200, 255), width=max(1, size // 64))
    
    # Bod uprostřed hodin
    dot_r = max(2, size // 32)
    draw.ellipse([clock_x - dot_r, clock_y - dot_r,
                   clock_x + dot_r, clock_y + dot_r],
                  fill=(0, 255, 255, 255))
    
    # Text "RZ" (Rozvrh) dole
    text_y = center + size // 4
    
    # Jednoduchý "pixel" text pro malé ikony
    if size >= 128:
        try:
            # Zkusit system font
            font_size = max(size // 8, 10)
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
            except:
                font = ImageFont.load_default()
            
            draw.text((center, text_y), "RZ", 
                       fill=(0, 255, 200, 200), 
                       font=font, 
                       anchor="mm")
        except:
            pass
    
    return img

def generate_icons():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    if not PIL_AVAILABLE:
        print("❌ Pillow není nainstalován. Spusť: pip install Pillow --break-system-packages")
        print("📁 Složka icons/ vytvořena – vlož ikony ručně nebo spusť po instalaci Pillow")
        
        # Vytvoř placeholder soubory
        for size in ICON_SIZES:
            path = os.path.join(OUTPUT_DIR, f"icon-{size}.png")
            print(f"  📌 Potřeba: {path}")
        return
    
    print(f"🎨 Generuji {len(ICON_SIZES)} ikon...")
    
    for size in ICON_SIZES:
        icon = create_icon_svg_style(size)
        path = os.path.join(OUTPUT_DIR, f"icon-{size}.png")
        icon.save(path, "PNG", optimize=True)
        print(f"  ✅ {path} ({size}x{size})")
    
    print(f"\n🚀 Hotovo! {len(ICON_SIZES)} ikon uloženo do ./{OUTPUT_DIR}/")
    print("📱 Nahraj složku icons/ spolu s ostatními soubory na GitHub Pages")

if __name__ == "__main__":
    generate_icons()
