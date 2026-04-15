import { CalendarSettingsSection } from './components/CalendarSettingsSection'
import { CurrencySettingsSection } from './components/CurrencySettingsSection'
import { PersonalInformationSection } from './components/PersonalInformationSection'
import { SaveSettingsButton } from './components/SaveSettingsButton'
import { SettingsFormWrapper } from './components/SettingsFormWrapper'
import { SettingsHeader } from './components/SettingsHeader'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SettingsHeader />
      <SettingsFormWrapper>
        <PersonalInformationSection />
        <CurrencySettingsSection />
        <CalendarSettingsSection />
        <div className="flex justify-start">
          <SaveSettingsButton />
        </div>
      </SettingsFormWrapper>
    </div>
  )
}
