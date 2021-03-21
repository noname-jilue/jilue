from pathlib import Path
import gzip
import subprocess
extpackBinaryLocation = Path(r'C:/Program Files/ARM/Mali Developer Tools/Mali Texture Compression Tool v4.3.0/bin/etcpack.exe')
for sgkFile in Path('.').rglob("*.sgk"):
    # if sgkFile.suffix != '.sgk':
    #     continue
    imgPath = sgkFile.with_suffix('.pkm')
    with gzip.open(sgkFile) as f:
        fileContent = f.read()
        imgPath.write_bytes(fileContent)
        # with open(imgPath, 'wb') as pkmFile:
        #     pkmFile.write(fileContent)
    subprocess.run([extpackBinaryLocation, imgPath.absolute(), imgPath.parent.absolute(), '-ext', 'PNG'], cwd= extpackBinaryLocation.parent)
    imgPath.unlink()