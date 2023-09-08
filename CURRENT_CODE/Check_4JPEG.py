import os
import shutil
from datetime import date

def copy_jpegs(folder):
    jpeg_files = []
    for file in os.listdir(folder):
        if file.lower().endswith(".jpeg"):
            jpeg_files.append(file)
    
    num_files = len(jpeg_files)
    
    if num_files == 1:
        src_file = os.path.join(folder, jpeg_files[0])
        dst_file = os.path.join(folder, "1.jpeg")
        shutil.copy(src_file, dst_file)
        shutil.copy(src_file, os.path.join(folder, "2.jpeg"))
        shutil.copy(src_file, os.path.join(folder, "3.jpeg"))
    
    elif num_files == 2:
        shutil.copy(os.path.join(folder, "0.jpeg"), os.path.join(folder, "2.jpeg"))
        shutil.copy(os.path.join(folder, "1.jpeg"), os.path.join(folder, "3.jpeg"))
    
    elif num_files == 3:
        shutil.copy(os.path.join(folder, "1.jpeg"), os.path.join(folder, "3.jpeg"))

    print(f"Processed folder: {folder}")

folder_path = "/var/www/html/Bimg/tmp"  # path to folders
now = date.today().strftime("%d_%m_%Y")
log_file = f"/var/www/html/Bimg/log/JPEG_missing_{now}.log"  # log file
missing_files_count = 0

with open(log_file, "w") as f:
    for folder in os.listdir(folder_path):
        full_path = os.path.join(folder_path, folder)
        if os.path.isdir(full_path):
            copy_jpegs(full_path)
            if not os.path.exists(os.path.join(full_path, "3.jpeg")):
                f.write(f"{folder}\n")
                missing_files_count += 1
                
    f.write("\n")            
    f.write(f"Total folders missing files: {missing_files_count}")

print("Log file created at:", log_file)
