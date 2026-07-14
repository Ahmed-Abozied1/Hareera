export interface SectionHeaderProps {
  title: string
  description?: string
  badge?: string
}


export type ProductCategoryTab = 'PAJAMAS' | 'ROBES'

export interface ProductsTabsProps {
  activeTab: ProductCategoryTab
  setActiveTab: (tab: ProductCategoryTab) => void
}