import os
import random

def getImageFiles(rootFolder):
    image_files = []

    def scan_folder(folder):
        for root, dirs, files in os.walk(folder):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                    file_path = os.path.join(root, file)
                    image_files.append(file_path)

    for root, dirs, files in os.walk(rootFolder):
        for dir in dirs:
            if dir == 'tmp':
                tmp_folder_path = os.path.join(root, dir)
                scan_folder(tmp_folder_path)

    random.shuffle(image_files)

    return image_files

root_folder = '/home/debian/webserver/PR/MosaicFaces/'
output_html = '/home/debian/webserver/PR/MosaicFaces/index.html'
image_files = getImageFiles(root_folder)
num_images = len(image_files)
num_cols = 4
num_rows = 1
total_cells = num_cols * num_rows
image_width = 100 / num_cols

with open(output_html, 'w') as f:
    f.write('<html>\n')
    f.write('<head>\n')
    f.write('<style>\n')
    f.write('html, body { margin: 0; padding: 0; overflow: hidden; }\n')
    f.write('.image { float: left; width: ' + str(image_width) + '%; height: 100%; }\n')
    f.write('img { width: 100%; height: 100%; object-fit: cover; }\n')
    f.write('</style>\n')
    f.write('</head>\n')
    f.write('<body>\n')

    f.write('<script>\n')
    f.write('var images = [' + ', '.join(['"' + './' + os.path.relpath(image_file, root_folder) + '"' for image_file in image_files]) + '];\n')
    f.write('var unusedImages = [...images];\n')  # Create a copy of the images array
    f.write('var currentImage = 0;\n')
    f.write('function rotateImage() {\n')
    f.write('    if (document.getElementById("image" + currentImage)) {\n')
    f.write('        if (unusedImages.length === 0) {\n')  # Reset the unusedImages array when it's empty
    f.write('            unusedImages = [...images];\n')
    f.write('        }\n')
    f.write('        var randomIndex = Math.floor(Math.random() * unusedImages.length);\n')
    f.write('        document.getElementById("image" + currentImage).src = unusedImages[randomIndex];\n')
    f.write('        unusedImages.splice(randomIndex, 1);  // Remove the used image from the array\n')
    f.write('        currentImage = (currentImage + 1) % ' + str(total_cells) + ';\n')
    f.write('    }\n')
    f.write('    setTimeout(rotateImage, 1000);\n')
    f.write('}\n')
    f.write('window.onload = function() {\n')
    f.write('    setTimeout(function() { rotateImage(); }, 1000);\n')
    f.write('}\n')
    f.write('</script>\n')

    for i in range(total_cells):  # to create 8x5 grid
        if i < len(image_files):
            image_path = './' + os.path.relpath(image_files[i], root_folder)
        else:
            # Use a placeholder if there aren't enough images
            image_path = 'https://c1t1zen.com/PR/PARROT_UFO.jpg'

        image_tag = '<div class="image">\n'
        image_tag += '    <img id="image' + str(i) + '" src="' + image_path + '">\n'
        image_tag += '</div>\n'
        f.write(image_tag)

    f.write('</body>\n')
    f.write('</html>\n')
