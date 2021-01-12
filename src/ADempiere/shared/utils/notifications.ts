import { Message, Notification } from 'element-ui'
import { ElMessageComponent, ElMessageOptions } from 'element-ui/types/message'
import { ElNotificationOptions } from 'element-ui/types/notification'
import language from '@/lang'
import VueI18n from 'vue-i18n'
// import router from '@/router'

export function hasTranslation(text: string): string {
  const hasKey: boolean = language.te('notifications.' + text)
  if (hasKey) {
    const translatedText: VueI18n.TranslateResult = language.t(
      'notifications.' + text
    )
    return translatedText.toString()
  }
  return text
}

/**
 *
 * @param {string} type, required
 * @param {string} title, required
 * @param {object} message
 * @param {string} summary
 * @param {string} name
 * @param {array} logs
 */

export type ShowNotificationOptions = ElNotificationOptions & {
    summary?: string
    name?: string
    logs?: any[]
    isRedirect?: boolean
}

export function showNotification(opts: ShowNotificationOptions) {
  const {
    type = opts.type || 'success',
    isRedirect = opts.isRedirect || true,
    logs = opts.logs || [],
    summary,
    name
  } = opts
  let { title, message } = opts

  title = hasTranslation(title)
  if (message) {
    message = hasTranslation(message.toString())
  }
  // For summary
  if (summary) {
    if (message) {
      message = `${message} <br> ${summary}`
    } else {
      message = summary
    }
  }
  // For logs
  if (logs && logs.length) {
    logs.forEach(logResult => {
      if (logResult) {
        message = `${message} <br> ${logResult.log}`
      }
    })
  }
  if (name) {
    message = `${name} ${message}`
  }

  return Notification({
    title,
    message: `
      <div style="max-height: 100px; overflow-y: auto;">
        ${message}
      </div>
    `,
    type,
    position: 'bottom-right',
    dangerouslyUseHTMLString: true,
    onClick() {
      if (isRedirect) {
        // router.push({
        //     name: 'ProcessActivity'
        // })
      }
    }
  })
}

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
