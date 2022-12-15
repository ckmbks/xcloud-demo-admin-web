import {
  VuexModule,
  Module,
  Action,
  Mutation,
  getModule
} from 'vuex-module-decorators'
import store from '@/store'
import DictApi from '@/api/DictApi'
import MedicalRecordApi from '@/api/MedicalRecordApi'
export interface IPatientState {
  toothPositionArea: any
  toothPositionAssistance: any
  toothPositionDeciduous: any
  toothPositionPermanent: any
  medicalRecordTemplate: any
}

@Module({ dynamic: true, store, name: 'patient' })
class Patient extends VuexModule implements IPatientState {
  medicalRecordTemplate: any
  public toothPositionArea = []
  public toothPositionAssistance = []
  public toothPositionDeciduous = []
  public toothPositionPermanent = []
  public medicalRecordTemplateMap = new Map()

  @Mutation
  SET_TOOTH(data: any) {
    this.toothPositionArea = data.toothPositionArea
    this.toothPositionAssistance = data.toothPositionAssistance
    this.toothPositionDeciduous = data.toothPositionDeciduous
    this.toothPositionPermanent = data.toothPositionPermanent
  }

  @Mutation
  SET_TEMPLATE(data: any) {
    const map = new Map()
    data.forEach((item: any) => {
      map.set(item.name, item.code)
    })
    this.medicalRecordTemplateMap = map
  }

  @Action
  public async getToothDic() {
    const res = await DictApi.getToothDic()
    this.SET_TOOTH(res)
  }

  //   @Action
  //   public async getTemplateEnum() {
  //     const res = await MedicalRecordApi.getTemplateEnum()
  //     this.SET_TEMPLATE(res)
  //   }
}

export const PatientModule = getModule(Patient)
