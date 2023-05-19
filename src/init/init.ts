import { XEnvUtils } from '../env_utils';
import '../common/log4js';
import { XConfigUtils } from './config_utils';
import { initMaster } from '../common/decorator/master.decorator';

function runtimeInit() {
    const rEnv = XConfigUtils.loadByEnv(XEnvUtils.env);
    if (rEnv.isNotOK) {
        process.exit(-2);
    }

    require('../common/master/allmaster');
    const r = initMaster();
    if (r.isNotOK) {
        process.exit(-1);
    }
}

runtimeInit();
