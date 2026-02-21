import { useState } from 'react';
import { execSync } from 'child_process';
import sudo from 'sudo-prompt';
import extract from 'extract-zip';
import path from 'path';
import os from 'os';
import fs from 'fs';

const useInstall = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([]);

  const install = async () => {
    setIsInstalling(true);
    if (os.platform() === 'win32') {
      if (!checkTelepresenceInstalled()) await windowsTelepresenceInstall();
    }
    setIsInstalling(false);
    localStorage.setItem('hasInstalled', 'true');
  };

  const pushLog = (message: string) => {
    setOutputLogs((logs) => [...logs, message]);
  };

  const checkTelepresenceInstalled = () => {
    try {
      execSync('telepresence version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  };

  const windowsTelepresenceInstall = async () => {
    const tmp = os.tmpdir();
    const zipPath = path.join(tmp, 'telepresence.zip');
    const extractPath = path.join(tmp, 'telepresenceInstaller', 'telepresence');

    pushLog('📦 Initiating Telepresence Install.');
    try {
      pushLog('📥 Downloading Telepresence ZIP...');
      const res = await fetch(
        'https://github.com/telepresenceio/telepresence/releases/latest/download/telepresence-windows-amd64.zip',
      );
      if (!res.ok) pushLog(`❌ Download failed: ${res.statusText}`);
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(zipPath, buffer);
      pushLog(`✅ ZIP downloaded (${buffer.length} bytes)`);

      if (!fs.existsSync(zipPath)) {
        throw new Error(`ZIP file not found: ${zipPath}`);
      }

      pushLog('🔁 Cleaning up old extract folder...');
      fs.rmSync(extractPath, { recursive: true, force: true });

      pushLog('📦 Extracting ZIP...');
      await extract(zipPath, { dir: extractPath });
      pushLog('✅ Extraction complete');

      pushLog('🗑️ Deleting ZIP file...');
      fs.unlinkSync(zipPath);

      pushLog('⚙️ Running Telepresence installer script...');
      const psScript = path.join(extractPath, 'install-telepresence.ps1');

      if (!fs.existsSync(psScript)) {
        throw new Error(`Installer script not found: ${psScript}`);
      }

      const command = `powershell.exe -ExecutionPolicy Bypass -Command "Set-Location -LiteralPath '${extractPath}'; & './install-telepresence.ps1'"`;

      await new Promise<void>((resolve, reject) => {
        sudo.exec(
          command,
          { name: 'Telepresence Installer' },
          (error, stdout, stderr) => {
            if (error) {
              pushLog(`❌ Install failed: ${error}`);
              reject();
            }
            if (stdout) pushLog(`📤 stdout:\n${stdout}`);
            if (stderr) pushLog(`⚠️ stderr:\n${stderr}`);
            resolve();
          },
        );
      });

      pushLog('🚮 Cleaning up installer folder...');
      fs.rmSync(path.join(tmp, 'telepresenceInstaller'), {
        recursive: true,
        force: true,
      });

      const telepresenceExe = path.join(
        'C:',
        'Program Files',
        'telepresence',
        'telepresence.exe',
      );
      if (!fs.existsSync(telepresenceExe)) {
        pushLog(`❌ Telepresence installation not found: ${telepresenceExe}`);
        return;
      }
      pushLog(`✅ Telepresence installation verified: ${telepresenceExe}`);
      pushLog('🎉 Telepresence installation complete!');
    } catch (err) {
      pushLog(`❌ Telepresence installation failed: ${err}`);
    }
  };

  return { outputLogs, isInstalling, install };
};

export default useInstall;
