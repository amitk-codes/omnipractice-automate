import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import ResponsiveWarning from '../components/ResponsiveWarning'
import { exampleData } from '../utils/exampleData'
import { checkClientDataHandler } from '../utils/handlers'

function App() {
  const [inputJson, setInputJson] = useState('')
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [logs, setLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'json' | 'logs'>('json')

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleLoadExample = (type: 'adult' | 'minor' | 'couple') => {
    setInputJson(JSON.stringify(exampleData[type], null, 2))
  }

  const handleRunAutomation = async () => {
    if (!inputJson.trim()) {
      setStatus('Please enter valid JSON input')
      return
    }

    try {
      // Validate JSON
      const parsedData = JSON.parse(inputJson)
      
      // Validate required fields
      const validationErrors = checkClientDataHandler(parsedData);
      if (validationErrors.length > 0) {
        setStatus(`Validation error: ${validationErrors.join(", ")}`);
        validationErrors.forEach(error => addLog(`Validation error: ${error}`));
        return;
      }
      
      // Clear any previous validation errors or status messages
      setStatus('')
      setLoading(true)
      addLog('Starting automation...')
      setActiveTab('logs')
      
      // Call our automation API endpoint
      const response = await fetch('/api/automate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: inputJson,
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setStatus('Automation completed successfully')
        addLog('Automation completed successfully')
      } else {
        setStatus(`Error: ${result.message}`)
        addLog(`Error: ${result.message}`)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        setStatus('Invalid JSON format')
        addLog('Invalid JSON format')
      } else {
        setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
        addLog(`Error: ${error instanceof Error ? error.message : String(error)}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <ResponsiveWarning />
      <div className="main-container">
        <h1 className="page-title">Omnipractice Client Automation</h1>
        
        <Card>
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'json' ? 'active' : ''}`}
              onClick={() => setActiveTab('json')}
            >
              JSON Input
            </div>
            <div 
              className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
            >
              Logs {logs.length > 0 && `(${logs.length})`}
            </div>
          </div>
          
          <div style={{ display: activeTab === 'json' ? 'block' : 'none' }}>
            <div className="form-group">
              <div className="form-header">
                <label className="label" htmlFor="jsonInput">
                  Client Data (JSON)
                </label>
                <div className="button-group">
                  <Button 
                    variant="secondary"
                    onClick={() => handleLoadExample('adult')}
                    className="btn-sm"
                  >
                    Adult Example
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleLoadExample('minor')}
                    className="btn-sm"
                  >
                    Minor Example
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleLoadExample('couple')}
                    className="btn-sm"
                  >
                    Couple Example
                  </Button>
                </div>
              </div>
              
              <div style={{ position: 'relative' }}>
                <Textarea
                  name="jsonInput"
                  rows={12}
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  placeholder="Enter client data in JSON format..."
                  className="font-mono"
                />
                {!inputJson && (
                  <div className="empty-state">
                    <p>Click one of the example buttons above to load sample data, or enter your own JSON</p>
                  </div>
                )}
              </div>
            </div>
            
            {status && (
              <div className={`alert ${status.includes('Error') || status.includes('Validation') ? 'alert-error' : 'alert-success'}`}>
                {status}
              </div>
            )}
            
            <div className="form-actions">
              <Button
                onClick={handleRunAutomation}
                disabled={loading || !inputJson.trim()}
                loading={loading}
                fullWidth
              >
                Run Automation
              </Button>
            </div>
          </div>
          
          <div style={{ display: activeTab === 'logs' ? 'block' : 'none' }}>
            <div className="form-group">
              <div className="form-header">
                <h2 className="label">Automation Logs</h2>
                <Button 
                  variant="secondary"
                  onClick={() => setLogs([])}
                  className="btn-sm"
                >
                  Clear Logs
                </Button>
              </div>
              <div className="logs-container">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="log-entry">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="empty-logs">
                    <p>No logs yet. Run automation to see activity here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  )
}

export default App 