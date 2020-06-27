/*
 * Copyright (c) 2017 Topcoder, Inc. All rights reserved.
 */

/*
 * App configurations
 */

/**
 * api base url
 * @type {string}
 */
export const SERVER_URL = process.env.NEXT_PUBLIC_API_PREFIX

export const META = {
  PAGE_TITLE_SUFFIX: 'MVP Web',
  PAGE_DESCRIPTION: 'MVP Web',
  PAGE_KEYWORDS: 'MVP Web',
}

// x minutes prior to an appointment, the video call icon will become enabled, unit is minute
export const ENABLE_MEETING_TIME = 60 * 24 * 7

// the default patient page size
export const DEFAULT_PATIENT_PAGE_SIZE = 10

export const BOD_FORMAT = 'MM/DD/YYYY' // date of birth
