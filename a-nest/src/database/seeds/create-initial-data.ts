import { DataSource } from 'typeorm';
import { SeederFactoryManager, Seeder } from 'typeorm-extension';
import { Workspaces } from '../../output/entities/Workspaces';
import { Channels } from '../../output/entities/Channels';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factory: SeederFactoryManager,
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspaces);
    await workspacesRepository.insert([
      { id: 1, name: 'Sleact', url: 'sleact' },
    ]);
    const channelRepository = dataSource.getRepository(Channels);
    await channelRepository.insert([
      { id: 1, name: 'Sleact', WorkspaceId: 1, private: false },
    ]);
  }
}
