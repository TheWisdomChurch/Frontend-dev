export interface NavLink {
  href: string;
  label: string;
}

export interface ExtendedNavLink {
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
  dropdown?: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  href: string;
}

export interface Leader {
  name: string;
  role: string;
  imageId: string;
}

export interface Sermon {
  title: string;
  preacher: string;
  date: string;
  imageId: string;
  videoId: string;
}

export interface Ministry {
  name: string;
  description: string;
  imageId: string;
}
