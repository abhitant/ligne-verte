import SimpleMap from '@/components/SimpleMap';
import Navigation from '@/components/Navigation';

const Map = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        <SimpleMap />
      </main>
    </div>
  );
};

export default Map;