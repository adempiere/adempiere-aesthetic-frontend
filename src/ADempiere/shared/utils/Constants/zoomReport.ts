import { IAttributeData } from '@/ADempiere/modules/persistence'
import { IZoomWindowRouteData } from './zoomWindow'

const today: Date = new Date()

const zoomReport: (Partial<IZoomWindowRouteData> & { parametersList: IAttributeData[] })[] = [
  {
    uuid: '92b9a696-adba-4409-a200-7df0ba74cb63',
    action: 'processOption',
    tabChild: undefined,
    parametersList: [{ columnName: 'ValidFrom', value: today }]
  },
  {
    uuid: '78b249ee-613e-4241-a2c1-00243fa36470',
    action: 'processOption',
    tabChild: undefined,
    parametersList: [{ columnName: 'ValidFrom', value: today }, { columnName: 'MustBeStocked', value: false }]
  }
]

export default zoomReport
