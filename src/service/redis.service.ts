import { Injectable } from '@nestjs/common';
import type Redis from 'ioredis';
import { XConfigUtils } from '../init/config_utils';
import { getLogger } from 'xmcommon';
const log = getLogger(__filename);

@Injectable()
export class XRedisService {
    private m_RedisClient: Redis;
    private m_Enabled: boolean;
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const redisClass = require('ioredis');
        const opts = XConfigUtils.buildRedisOption(XConfigUtils.getConfig().redis);
        let redis: Redis;

        this.m_Enabled = opts.enabled === true;

        if (opts.url) {
            redis = new redisClass(opts.url);
        } else if (opts.opts) {
            redis = new redisClass(opts.opts);
        } else {
            redis = new redisClass();
        }
        redis.on('error', (paramError: any) => {
            if (paramError) {
                if (paramError.code !== 'ECONNRESET') {
                    log.error('getRedis >>>----------', JSON.stringify(paramError));
                } else {
                    log.error('getRedis aaa >>>----------', JSON.stringify(paramError));
                    // 因为这个日志，打出来非常多，所以就不用打印了
                    // 大概是每隔65秒，会打印一次这个log，连接会ECONNRESET一次
                    // log.error('----------ECONNRESET', JSON.stringify(error));
                }
            }
        });

        this.m_RedisClient = redis;
    }

    public get enabled() {
        return this.m_Enabled;
    }

    public async get(paramKey: string) {
        if (this.enabled) {
            return this.m_RedisClient.get(paramKey);
        } else {
            log.error('for get:在配置文件redis中的enabled值为false, 表示redis未启用, 如果要使用，请配置为true');
            return;
        }
    }

    public async set(paramKey: string, paramValue: string, paramTTL = -1) {
        if (this.enabled) {
            if (paramTTL > 0) {
                return this.m_RedisClient.set(paramKey, paramValue, 'EX', paramTTL);
            } else {
                return this.m_RedisClient.set(paramKey, paramValue);
            }
        } else {
            log.error('for set:在配置文件redis中的enabled值为false, 表示redis未启用, 如果要使用，请配置为true');
            return;
        }
    }
}
