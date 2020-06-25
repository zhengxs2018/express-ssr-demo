const VerificationCodeTypes = {
  SignUp: 'signUp',
  ForgotPassword: 'forgotPassword',
}

const BooleanStrings = {
  True: 'true',
  False: 'false',
}

const NylasAuthScopes = {
  Calendar: 'calendar',
}

const AppointmentTypes = {
  Ongoing: 'ongoing',
  Upcoming: 'upcoming',
  Past: 'past',
}

const MeetingTypes = {
  Instant: 1,
  Scheduled: 2,
  RecurringWithNoFixedTime: 3,
  RecurringWithFixedTime: 8,
}

const FormFileStatus = {
  missing: 'missing',
  pendingReview: 'pending review',
  approved: 'approved',
  rejected: 'rejected',
}

const DELRequestStatus = {
  pending: 'pending',
  confirmed: 'confirmed',
}

const FileType = {
  newForms: 'newForms',
  returnDocuments: 'returnDocuments',
}

const ConversationType = {
  inbox: 'inbox',
  sent: 'sent',
  delete: 'delete',
  archived: 'archived',
}

module.exports = {
  VerificationCodeTypes,
  BooleanStrings,
  AppointmentTypes,
  NylasAuthScopes,
  MeetingTypes,
  FormFileStatus,
  ScheduleKey,
  DELRequestStatus,
  FileType,
}
