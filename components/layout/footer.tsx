export function Footer() {
  return (
    <footer className="border-t bg-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} CreatorMind. Built for creators, by creators.</p>
        </div>
      </div>
    </footer>
  );
}