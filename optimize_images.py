import os
from PIL import Image

image_dir = "images/"
max_size = (1000, 1000)

for filename in os.listdir(image_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filepath = os.path.join(image_dir, filename)
        try:
            with Image.open(filepath) as img:
                # Calculate size
                width, height = img.size
                if width > max_size[0] or height > max_size[1]:
                    print(f"Resizing {filename} ({width}x{height})...")
                    img.thumbnail(max_size, Image.LANCZOS)
                    # Convert to RGB if saving as JPG (handling RGBA PNGs if needed, though usually fine)
                    if filename.lower().endswith(('.jpg', '.jpeg')) and img.mode == 'RGBA':
                         img = img.convert('RGB')
                    
                    img.save(filepath, optimize=True, quality=85)
                    print(f"Saved optimized {filename}")
                else:
                    print(f"Skipping {filename} (already small enough)")
        except Exception as e:
            print(f"Error processing {filename}: {e}")
