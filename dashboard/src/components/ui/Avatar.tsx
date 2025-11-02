import { User, Upload } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  editable?: boolean;
  onUpload?: (file: File) => void;
}

export default function Avatar({ src, name, size = 'md', editable = false, onUpload }: AvatarProps) {
  // Check for stored avatar
  const storedAvatar = localStorage.getItem('userAvatar');
  const avatarSrc = src || storedAvatar;
  
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // Store in localStorage for demo
        localStorage.setItem('userAvatar', imageUrl);
        // Trigger re-render by calling onUpload if provided
        if (onUpload) {
          onUpload(file);
        }
        // Show success message and trigger parent component update
        if (onUpload) {
          onUpload(file);
        }
        // Trigger a custom event to update header
        window.dispatchEvent(new Event('avatarUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`${sizes[size]} relative`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-100 flex items-center justify-center`}>
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
        ) : name ? (
          <span className="text-gray-600 font-medium text-sm">{getInitials(name)}</span>
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
      </div>
      
      {editable && (
        <label className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
          <Upload className="h-3 w-3 text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}