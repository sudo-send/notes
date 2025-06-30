import Button from '@/Components/Button/Button'
import DecoratedInput from '@/Components/Input/DecoratedInput'
import { FunctionComponent, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import ConfirmCustomPlugin from './ConfirmCustomPlugin'
import PreferencesSegment from '../../../PreferencesComponents/PreferencesSegment'
import { useApplication } from '@/Components/ApplicationProvider'
import { ThirdPartyFeatureDescription } from '@standardnotes/snjs'

const PRESET_PLUGINS = [
  { label: 'CHOOSE Markdown Visual', url: 'https://standardnotes.github.io/plugins/cdn/dist/entries/com.sncommunity.markdown-visual.json' },
  { label: 'CHOOSE Advanced Checklist', url: 'https://standardnotes.github.io/plugins/cdn/dist/entries/com.sncommunity.advanced-checklist.json' },
  { label: 'CHOOSE Scratch Editor', url: 'https://scratch-editor.com/ext.json' },
  { label: 'CHOOSE Excalidraw', url: 'https://nienow.github.io/sn-excalidraw/ext.json' },
  { label: 'CHOOSE Mermaid', url: 'https://nienow.github.io/sn-mermaid/ext.json' },
]

type Props = {
  className?: string
}

const InstallCustomPlugin: FunctionComponent<Props> = ({ className = '' }) => {
  const application = useApplication()

  const [customUrl, setCustomUrl] = useState('')
  const [confirmablePlugin, setConfirmablePlugin] = useState<ThirdPartyFeatureDescription | undefined>(undefined)

  const confirmableEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (confirmablePlugin) {
      confirmableEnd.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [confirmablePlugin, confirmableEnd])

  const submitPluginUrl = async (url: string) => {
    const plugin = await application.pluginsService.getPluginDetailsFromUrl(url)
    if (plugin) {
      setConfirmablePlugin(plugin)
    }
  }

  const confirmPlugin = async (confirm: boolean) => {
    if (confirm && confirmablePlugin) {
      await application.pluginsService.installExternalPlugin(confirmablePlugin)
    }
    setConfirmablePlugin(undefined)
    setCustomUrl('')
  }

  return (
    <div className={className}>
      <div>
        {!confirmablePlugin && (
          <PreferencesSegment>
            <div>
              <DecoratedInput
                placeholder={'Enter Plugin URL'}
                value={customUrl}
                onChange={(value) => {
                  setCustomUrl(value)
                }}
              />
            </div>
            <Button
              hidden={customUrl.length === 0}
              disabled={customUrl.length === 0}
              className="mt-4 min-w-20"
              primary
              label="Install"
              onClick={() => submitPluginUrl(customUrl)}
            />
            <div className="mt-4 flex flex-col gap-2">
              {PRESET_PLUGINS.map((plugin, index) => (
                <Button
                  key={index}
                  className="min-w-20"
                  label={plugin.label}
                  onClick={() => setCustomUrl(plugin.url)}
                />
              ))}
            </div>
          </PreferencesSegment>
        )}
        {confirmablePlugin && (
          <PreferencesSegment>
            <ConfirmCustomPlugin plugin={confirmablePlugin} callback={confirmPlugin} />
            <div ref={confirmableEnd} />
          </PreferencesSegment>
        )}
      </div>
    </div>
  )
}

export default observer(InstallCustomPlugin)
