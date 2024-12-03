/**
 * Computed with
 * @see http://www.tundraman.com/Guitars/FretCalc/index.php
 * distance from nut in mm
 *
 * for a 25.5" scale
 * @type {number[]}
 */
export const fretPositions = [
    0,
    36.316,
    70.596,
    102.954,
    133.498,
    162.329,
    189.543,
    215.232,
    239.48,
    262.369,
    283.974,
    304.368,
    323.619,
    341.790,
    358.942,
    375.133,
    390.415,
    404.841,
    418.458,
    431.312,
    443.444,
    454.897,
    465.707,
    475.912,
    485.544,
]

export const fretPositionsMeter = fretPositions.map(d => d / 1000)
