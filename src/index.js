import  __Storage from "store";

const KEY_EXPIRE_LIST = "@@EXPIRE_STORE";

/**
 * 将缓存加入标记
 * @param key
 */
function pushCacheQuery(key,level=1){
    let curStore = __Storage.get(KEY_EXPIRE_LIST) || {};
    curStore[key]=level;
    __Storage.set(KEY_EXPIRE_LIST,curStore);
}




function clearByLevel(level){
    let curStore = __Storage.get(KEY_EXPIRE_LIST) || {};

    for(let key in curStore){
        let keyLevel =curStore(key);
        if(keyLevel<level){
            cacheRemove(key);
        }
    }

}

function clearByPrefix(prefix){
    let curStore = __Storage.get(KEY_EXPIRE_LIST) || {};
    for(let key in curStore){
        if(key.indexOf(prefix)>-1){
            checkValid(key);
        }
    }
}


function clearByExpire(){
    let curStore = __Storage.get(KEY_EXPIRE_LIST) || {};
    for(let key in curStore){

        checkValid(key);
    }
}


/**
 * 清除已过期的缓存
 */
function clearExpireCache(opts={}){
    let {prefix,level} = opts;
    if(level){
        clearByLevel(level);
        return;
    }
    if(prefix){
        clearByPrefix(prefix);
        return;
    }
    //default
    clearByExpire();

}

function checkValid(key) {
    let info = info || __Storage.get(key);
    checkExpireViaTime(key,info);
    checkExpireViaRead(key,info);
}

function cacheRemove(key){
    let curStore = __Storage.get(KEY_EXPIRE_LIST) || {};
    delete curStore[key];
    __Storage.set(KEY_EXPIRE_LIST,curStore)
    __Storage.remove(key);
}


function checkExpireViaTime(key,info){
    info = info || __Storage.get(key);
    if (info.exp != -1 && (new Date().getTime() - info.time > info.exp)) {
        cacheRemove(key);
        return false;
    }else{
        return true;
    }
}

function checkExpireViaRead(key,info){
    info = info || __Storage.get(key);

    if (info && info.read != -1) {

        let readed = (info.readed || 0);

        if(readed>=info.read){
            cacheRemove(key);
            return false;
        }else{
            let curReadTime = readed+1;
            if (curReadTime == info.read) {
                cacheRemove(key);
            }else{
                info.readed = curReadTime;
                __Storage.set(key, info);
            }
            return true;
        }

    } else {
        return true;
    }
}

/**
 * 缓存设置
 * @param key
 * @param val
 * @param exp：时间策略
 * @param read：读写次数策略
 * @param level：缓存级别
 */
function setCache (key, val, {exp = -1, read = -1,level=1}) {

    __Storage.set(key, {
        val: val,
        exp: exp == -1 ? -1 : exp * (60 * 1000),
        time: new Date().getTime(),
        read: read,
        level:level
    })

    pushCacheQuery(key,level);

}


let cacheConfig = {
    exp:1,
    read:5
}


setTimeout(function(){
    clearByExpire()
},1)



export let store = __Storage;
export let cache = {
    install(config={}){
        Object.assign(cacheConfig,config)
    },

    clear(opts){
        clearExpireCache(opts);
    },
    remove: function (key) {
        cacheRemove(key);
    },
    def(key,val){
        setCache(key,val,cacheConfig);
    },
    set:setCache,
        get(key) {
        var info = __Storage.get(key);

        if (!info) {
            return null
        }

        // 时间策略
        if(!checkExpireViaTime(key,info)){
            return null;
        }
        //读取次数策略
        if(!checkExpireViaRead(key,info)){
            return null;
        }

        return info.val;
    }
}
