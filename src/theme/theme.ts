import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

import { fonts } from './fonts'
import { colors } from './colors'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true
}

const theme = extendTheme({ config, fonts, colors })

export default theme
