import { Message } from 'element-ui'
import { ElMessageComponent, ElMessageOptions } from 'element-ui/types/message'
/**
 *
 * @param {string} type
 * @param {string} message
 * @param {number} duration
 */

export function showMessage(opts: ElMessageOptions): ElMessageComponent {
  let delay = 3000
  if (opts.type === 'info') {
    delay = 2000
  }

  return Message({
    message: opts.message,
    type: opts.type || 'success',
    showClose: true,
    duration: opts.duration || delay
  })
}
