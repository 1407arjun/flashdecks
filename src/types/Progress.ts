import Status from './Status'

type Progress = {
  [Status.REVIEW]: number
  [Status.WRONG]: number
  [Status.MASTERED]: number
  total: number
}

export default Progress
