import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import icon from '@datalayer/icons-react/data2/EyesIconLabIcon';
import { requestAPI } from './handler';
import { JupyterViewerWidget } from './widget';

import '../style/index.css';

/**
 * The command IDs used by the plugin.
 */
namespace CommandIDs {
  export const create = 'create-jupyter-viewer-widget';
}

/**
 * Initialization data for the @datalayer/jupyter-viewer extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@datalayer/jupyter-viewer:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ISettingRegistry, ILauncher],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingRegistry: ISettingRegistry | null,
    launcher: ILauncher
  ) => {
    const { commands } = app;
    const command = CommandIDs.create;
    commands.addCommand(command, {
      caption: 'Show Viewer',
      label: 'Viewer',
      icon,
      execute: () => {
        const content = new JupyterViewerWidget(app);
        const widget = new MainAreaWidget<JupyterViewerWidget>({ content });
        widget.title.label = 'Viewer';
        widget.title.icon = icon;
        app.shell.add(widget, 'main');
      }
    });
    const category = 'Datalayer';
    palette.addItem({ command, category });
    if (launcher) {
      launcher.add({
        command,
        category,
        rank: 6.7,
      });
    }
    console.log('JupyterLab plugin @datalayer/jupyter-viewer is activated!');
    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('@datalayer/jupyter-viewer settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for @datalayer/jupyter-viewer.', reason);
        });
    }
    requestAPI<any>('config')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `Error while accessing the jupyter server jupyter_viewer extension.\n${reason}`
        );
      });
  }
};

export default plugin;
