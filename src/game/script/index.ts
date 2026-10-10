import type { Script } from '../types'
import { CHAPTER1 } from './chapter1'
import { CHAPTER2 } from './chapter2'
import { CHAPTER3 } from './chapter3'
import { CHAPTER4 } from './chapter4'
import { CHAPTER5 } from './chapter5'

/** All scenes from every chapter. Scene names must be unique across chapters. */
export const SCRIPT: Script = { ...CHAPTER1, ...CHAPTER2, ...CHAPTER3, ...CHAPTER4, ...CHAPTER5 }
