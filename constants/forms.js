const ProviderFields = ['firstName', 'lastName', 'roles', 'address', 'providerInfo', 'createdAt', 'updatedAt', 'email']

const CalendarEventFields = ['title', 'description', 'participants', 'status']

const AppointmentFields = [
  'id',
  'providerId',
  'patientId',
  'meetingId',
  'patientPaid',
  'meetingPassword',
  'startTime',
  'endTime',
  'description',
  'status',
  'hostJoined',
  'followUp',
  'returnDocuments',
]

const MeetingFields = ['id', 'topic', 'status', 'start_time', 'duration', 'password']

const ShortUserFields = ['id', 'email', 'firstName', 'lastName', 'headUrl']

module.exports = {
  ProviderFields,
  CalendarEventFields,
  AppointmentFields,
  MeetingFields,
  ShortUserFields,
}
