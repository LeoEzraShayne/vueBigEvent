import { defineStore } from 'pinia'
import { ref } from 'vue'

//正常导出
// export const useUserInfoStore = defineStore('userInfo', () => {
//     const info = ref({})

//     const setInfo = (newInfo) => {
//         info.value = newInfo
//     }

//     const removeInfo = () => {
//         info.value = {}
//     }
//     return { info, setInfo, removeInfo }

// }, { persist: true })

//默认导出
 const useUserInfoStore = defineStore('userInfo', () => {
    const info = ref({})

    const setInfo = (newInfo) => {
        info.value = newInfo
    }

    const removeInfo = () => {
        info.value = {}
    }
    return { info, setInfo, removeInfo }

}, { persist: true })

//如果用默认导出 使用函数的文件要这么导入
// import useUserInfoStore from '@/stores/userInfo.js'
//useUserInfoStore 外面不加大括号
export default useUserInfoStore;
