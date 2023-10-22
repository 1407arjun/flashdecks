import Status from './Status'

type Progress = {
  [Status.NEW]: number
  [Status.REVIEW]: number
  [Status.WRONG]: number
  [Status.MASTERED]: number
}

export default Progress
