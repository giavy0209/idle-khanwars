import { FC } from "react";
import ReactJoyride from "react-joyride";
const steps = [
  {
    target: '.map .view',
    content: 'Click any where you want to place your castle, at start, you may want to keep distance from another player'
  },
  {
    target: '.map .control',
    content: 'Control map here'
  },
  {
    target: '.map .zoom',
    content: 'Zoom in/out map here'
  },
  {
    target: '.map .move-to .coordinate',
    content: 'Select coordinate for fast moving'
  },
  {
    target: '.map .castle',
    content: 'Click here to go into your castle'
  },
]
interface IJoiride {
  run: boolean
}
const Joiride: FC<IJoiride> = ({ run }) => {

  return <ReactJoyride
    steps={steps}
    run={run}
    continuous
    showProgress
  />
}

export default Joiride