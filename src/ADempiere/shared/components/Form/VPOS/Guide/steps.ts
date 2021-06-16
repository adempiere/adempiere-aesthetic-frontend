import language from '@/lang'
import { Step } from 'driver.js'

export interface IStepData extends Step {
    panel?: string
}

const steps: IStepData[] = [
  {
    element: '#ProductValue',
    popover: {
      title: language.t('form.productInfo.codeProduct').toString(),
      description: language.t('form.guideSteps.productValue.description').toString(),
      position: 'bottom'
    }
  },
  {
    element: '#BusinessPartner',
    popover: {
      title: language.t('form.pos.order.BusinessPartnerCreate.businessPartner').toString(),
      description: '',
      position: 'bottom'
    }
  },
  {
    element: '#linesOrder',
    popover: {
      title: language.t('form.guideSteps.linesTable.title').toString(),
      description: '',
      position: 'top'
    }
  },
  {
    element: '#buttonPanelLeftPos',
    popover: {
      title: language.t('form.guideSteps.buttonPanelLeftPos.title').toString(),
      description: '',
      position: 'right'
    }
  },
  {
    element: '#toolPoint',
    popover: {
      title: language.t('form.guideSteps.toolsPoint.title').toString(),
      description: '',
      position: 'bottom'
    }
  },
  {
    element: '#point',
    popover: {
      title: language.t('form.pos.title').toString(),
      description: '',
      position: 'right'
    }
  },
  {
    element: '#buttonPanelRightPos',
    popover: {
      title: language.t('form.guideSteps.buttonPanelRightPos.title').toString(),
      description: '',
      position: 'left'
    }
  },
  {
    element: '#fieldListCollection',
    popover: {
      title: language.t('form.guideSteps.fieldListCollection.title').toString(),
      description: '',
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#buttonCollection',
    popover: {
      title: language.t('form.guideSteps.buttonCollection.title').toString(),
      description: '',
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#cardCollection',
    popover: {
      title: language.t('form.guideSteps.cardCollection.title').toString(),
      description: '',
      position: 'left'
    },
    panel: 'Collection'
  },
  {
    element: '#infoInvoce',
    popover: {
      title: language.t('form.guideSteps.infoInvoce.title').toString(),
      description: '',
      position: 'top'
    },
    panel: 'Collection'
  }
]
export default steps
