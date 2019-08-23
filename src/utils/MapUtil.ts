/**
 * @Author: yanxinaliang (rainyxlxl@163.com)
 * @Date: 2019/8/23 17:35
 * @Last Modified by: yanxinaliang (rainyxlxl@163.com)
 * @Last Modified time: 2019/8/23 17:35
 * @disc:MapUtils
 */

class MapUtil {
    public static toArray<K,V>(map:Map<K,V>){
        const arr:V[]=[];
        map.forEach((value:V,key:K)=>{
            arr.push(value);
        });
        return arr;
    }
}

export {MapUtil}