import  __Storage from "store";



/**
 * 将缓存加入标记
 * @param key
 */
function pushCacheQuery(key){
    let curStore = __Storage.get("@@EXPIRE_STORE") || [];
    curStore.push(key);
    __Storage.set('@@EXPIRE_STORE',curStore);
}




/**
 * 清除已过期的缓存
 */
function clearExpireCache(prefix){
    let curStore = __Storage.get("@@EXPIRE_STORE") || [];

    curStore.forEach(key=>{

        if(prefix){
            if(key.indexOf(prefix)>-1){
                checkValid(key);
            }

        }else{
            checkValid(key);
        }

    })
}

function checkValid(key) {
    let info = info || __Storage.get(key);
    checkExpireViaTime(key,info);
    checkExpireViaRead(key,info);
}

function checkExpireViaTime(key,info){
    info = info || __Storage.get(key);
    if (info.exp != -1 && (new Date().getTime() - info.time > info.exp)) {
        __Storage.remove(key);
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
            __Storage.remove(key);
            return false;
        }else{
            let curReadTime = readed+1;
            if (curReadTime == info.read) {
                __Storage.remove(key);
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


function setCache (key, val, {exp = -1, read = -1}) {

    __Storage.set(key, {
        val: val,
        exp: exp == -1 ? -1 : exp * (60 * 1000),
        time: new Date().getTime(),
        read: read
    })

    pushCacheQuery(key);

}


let cacheConfig = {
    exp:1,
    read:5
}



export default {
    store:__Storage,
    cache:{
        install(config={}){
            Object.assign(cacheConfig,config)
        },
        clear(prefix){
            clearExpireCache(prefix);
        },
        remove: function (key) {
            __Storage.remove(key);
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


}
