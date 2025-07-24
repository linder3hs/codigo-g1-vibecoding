/**
 * Header component for the todo application
 * Displays the main title and subtitle
 */

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <header className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-lg">{subtitle}</p>
    </header>
  );
};

export default Header;
