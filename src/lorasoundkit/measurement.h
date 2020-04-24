/*--------------------------------------------------------------------
  This file is part of the TTN-Apeldoorn Sound Sensor.

  This code is free software:
  you can redistribute it and/or modify it under the terms of a Creative
  Commons Attribution-NonCommercial 4.0 International License
  (http://creativecommons.org/licenses/by-nc/4.0/) by
  TTN-Apeldoorn (https://www.thethingsnetwork.org/community/apeldoorn/) 

  The program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
  --------------------------------------------------------------------*/

/*!
 * \file measurement.h
 * \brief measurement class for TTN-Apeldoorn Sound Sensor.
 * Converts energy spectrum to a weighted DB level.
 * \author Marcel Meek
 * \date See revision table
 * \version see revision table
 * 
 * ## version
 * 
 * version | date       | who            | Comment
 * --------|------------|----------------|-------------------------------------
 * 0.1     | 22-4-2020  | Marcel Meek    | Initial release within community for
 *         |            |                | review and testing within dev-team
 * 0.2     | 24-4-2020  | Remko Welling  | Added headers, Sanitize code, add 
 *         |            |                | Doxygen compatible comments, add 
 *         |            |                | include guards
 *         |            |                |
 *         |            |                |
 *
 * # References
 *
 * This code is inspired on code of third parties:
 * - example: https://bitbucket.org/edboel/edboel/src/master/noise/
 * 
 * # Dependencies
 * 
 * 
 * # ToDo
 * \todo RW Add documentation on hardware connections
 */

#ifndef __MEASUREMENT_H_
#define __MEASUREMENT_H_

#define OCTAVES 9

// A-weighting and C-weighting curve from 31.5 Hz ... 8kHz in steps of whole octaves
// spectrum           31.5Hz 63Hz  125Hz 250Hz  500Hz 1kHz 2kHz 4kHz  8kHz
#define A_WEIGHTING { -39.4, -26.2, -16.1, -8.6, -3.2, 0.0, 1.2, 1.0, -1.1 };
#define C_WEIGHTING {  -3.0,  -0.8,  -0.2,  0.0,  0.0, 0.0, 0.2, 0.3, -3.0 };
#define Z_WEIGHTING {   0.0,  -0.0,  -0.0,  0.0,  0.0, 0.0, 0.0, 0.0,  0.0 };


class Measurement {
  public:
    Measurement( float* weighting);
    void reset();
    void update( float* energies);     
    void calculate();
    float decibel(float v);
    void print();

   // public members
   /// \todo remove public members and add functions to handle member variables
   ///       to meet principle of data-hiding.
   /// \todo rename member variables with prefix '_' to indicate member variables.
   
    float spectrum[OCTAVES];  ///< Array of results in dB per frequency band.
    float peak;               ///< Peak value in dB for all bands.
    float avg;                ///< Average value in dB for all bands.

  private:
    float* _weighting;
    int _count;
}; 

#endif //__MEASUREMENT_H_