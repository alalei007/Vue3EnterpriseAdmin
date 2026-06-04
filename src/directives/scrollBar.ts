import PerfectScrollbar from 'perfect-scrollbar'
// import { type DirectiveBinding } from 'vue'

interface HTMLElementWithPs extends HTMLElement {
  _ps_?: PerfectScrollbar
}
const el_scrollBar = (el: HTMLElementWithPs) => {
  //在元素上加点私货，名字随便取，确保不会和已有属性重复即可，我取名叫做_ps_
  if (el._ps_ instanceof PerfectScrollbar) {
    el._ps_.update()
  } else {
    //el上挂一份属性
    el._ps_ = new PerfectScrollbar(el, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,
      maxScrollbarLength: 300,
      suppressScrollX: false,
      suppressScrollY: false,
      scrollXMarginOffset: -5,
      scrollYMarginOffset: -5,
    })
    if (!el.classList.contains('ps-focus')) {
      el.classList.add('ps-focus')
    }
  }
}
export const scrollBar = {
  mounted: (el: HTMLElement) => {
    const rules = ['fixed', 'absolute', 'relative']
    if (!rules.includes(window.getComputedStyle(el, null).position)) {
      console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join('、')}`)
    }
    el_scrollBar(el)
  },

  // updated(el: HTMLElement, binding: DirectiveBinding, vnode: import('vue').VNode) {
  // try {
  //   //vnode.context其实就是vue实例，这里其实无需实例也直接用Vue的静态方法
  //   //故而也可以写成Vue.nextTick
  //   vnode.context.$nextTick(() => {
  //     el_scrollBar(el)
  //   })
  // } catch (error) {
  //   console.error(error)
  //   el_scrollBar(el)
  // }
  // },
}

export default scrollBar
