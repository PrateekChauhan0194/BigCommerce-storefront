import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';

export class FileUtils {
    public static deleteFiles(path: any): void {
        if (existsSync(path)) {
            readdirSync(path).forEach(function (file: string) {
                const curPath = path + '/' + file;
                if (lstatSync(curPath).isDirectory()) {
                    // recurse
                    FileUtils.deleteFiles(curPath);
                } else {
                    // delete file
                    unlinkSync(curPath);
                }
            });
            rmdirSync(path);
        }
    }
}
