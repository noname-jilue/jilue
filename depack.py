from pathlib import Path
import gzip
import subprocess
from multiprocessing.pool import ThreadPool
import time

extpackBinary = Path(r'C:/Program Files/ARM/Mali Developer Tools/Mali Texture Compression Tool v4.3.0/bin/etcpack.exe')
# def do_file(f):
#     imgPath = f.with_suffix('.pkm')
#     with gzip.open(f) as f:
#         fileContent = f.read()
#         imgPath.write_bytes(fileContent)
#         # with open(imgPath, 'wb') as pkmFile:
#         #     pkmFile.write(fileContent)
#     subprocess.run([extpackBinary, imgPath.absolute(), imgPath.parent.absolute(), '-ext', 'PNG'], cwd= extpackBinary.parent)
#     imgPath.unlink()
#     print(f)

if __name__ == "__main__":
    # with ThreadPool(16) as pool:
    #     # pool.apply(do_file, Path('.').rglob("*.sgk"))
    #     for f in Path('.').rglob("*.sgk"):
    #         pool.apply_async(do_file, (f,))
    #     pool.close()
    #     pool.join()
        

    for sgkFile in Path('.').rglob("*.sgk"):
        # if sgkFile.suffix != '.sgk':
        #     continue
        imgPath = sgkFile.with_suffix('.pkm')
        with gzip.open(sgkFile) as f:
            fileContent = f.read()
            imgPath.write_bytes(fileContent)
            # with open(imgPath, 'wb') as pkmFile:
            #     pkmFile.write(fileContent)
        subprocess.run([extpackBinary, imgPath.absolute(), imgPath.parent.absolute(), '-ext', 'PNG'], cwd= extpackBinary.parent)
        imgPath.unlink()