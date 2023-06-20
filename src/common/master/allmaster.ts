import fs from 'fs';
import path from 'path';
import { utils, getLogger } from 'xmcommon';
const log = getLogger(__filename);

/** 加载所有的master */
function loadMaster(paramPath: string, paramRegExp: RegExp) {
    // 指定目录下的所有文件
    const fileList = fs.readdirSync(paramPath, { withFileTypes: true });
    // 指定目录下，匹配成功的master文件名列表
    const masterList: string[] = [];

    fileList.forEach((paramD) => {
        // 如果是文件，并且文件名匹配成功
        if (paramD.isFile() && utils.isNotNull(paramD.name.match(paramRegExp))) {
            masterList.push(paramD.name);
        }
    });
    // 依次加载
    masterList.forEach((paramF) => {
        const fullName = path.join(paramPath, paramF);
        log.info('load master:' + fullName);
        require(fullName);
    });
}

loadMaster(__dirname, /\.master\.js$/);
