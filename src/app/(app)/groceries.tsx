import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  Button,
  Checkbox,
  Modal,
  Select,
  Text,
  useModal,
} from '@/components/ui';
import { FocusAwareStatusBar } from '@/components/ui/focus-aware-status-bar';

type GroceryItem = {
  id: string;
  name: string;
  price?: string;
  quantity: string;
  category: string;
  isChecked: boolean;
  date: string; // Format: "YYYY-MM-DD"
};

type Category = {
  id: string;
  name: string;
};

const categories = {
  PRODUCE: 'Produce',
  DAIRY: 'Dairy',
  MEAT: 'Meat',
  BAKERY: 'Bakery',
  FROZEN: 'Frozen',
  PANTRY: 'Pantry',
  OTHER: 'Other',
} as const;

const INITIAL_ITEMS: GroceryItem[] = [
  {
    id: '1',
    name: 'Apples',
    quantity: '6',
    price: '5.99',
    category: categories.PRODUCE,
    isChecked: false,
    date: '2025-04-01',
  },
];

const CATEGORIES: Category[] = [
  { id: '1', name: 'Produce' },
  { id: '2', name: 'Dairy' },
  { id: '3', name: 'Meat' },
  { id: '4', name: 'Pantry' },
  { id: '5', name: 'Frozen' },
  { id: '6', name: 'Beverages' },
  { id: '7', name: 'Snacks' },
  { id: '8', name: 'Other' },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DEFAULT_MONTHS = [
  ...MONTHS.map((month) => `${month} 2025`),
  ...MONTHS.map((month) => `${month} 2024`),
  ...MONTHS.map((month) => `${month} 2023`),
];

function Header() {
  return (
    <View className="px-4 pt-4">
      <Text className="text-2xl font-bold">Grocery List</Text>
      <Text className="text-gray-500">Keep track of your shopping items</Text>
    </View>
  );
}

function MonthSelector({
  selectedMonth,
  onPress,
}: {
  selectedMonth: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mt-4 flex-row items-center justify-between rounded-xl bg-gray-100 p-4"
    >
      <Text className="text-lg font-medium">{selectedMonth}</Text>
      <Ionicons name="chevron-down" size={24} color="#666" />
    </TouchableOpacity>
  );
}

function AddItemButton({ onPress }: { onPress: () => void }) {
  return (
    <View className="mb-6 px-4">
      <Button
        testID="add-item-button"
        onPress={onPress}
        className="h-[44px] rounded-xl bg-primary-500"
        label="Add Item"
      />
    </View>
  );
}

function calculateItemTotal(item: GroceryItem): number {
  const price = parseFloat(item.price || '0');
  const quantity = parseFloat(item.quantity || '1');
  return isNaN(price) || isNaN(quantity) ? 0 : price * quantity;
}

function formatPrice(price: number): string {
  return price.toFixed(2);
}

function calculateTotal(items: GroceryItem[]): string {
  const total = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  return formatPrice(total);
}

function ItemActions({
  onEdit,
  onDelete,
  index,
}: {
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  return (
    <View className="flex-row items-center space-x-2">
      <TouchableOpacity
        testID={`edit-item-${index}`}
        onPress={onEdit}
        className="rounded-full bg-gray-100 p-2"
        hitSlop={8}
      >
        <Ionicons name="pencil" size={16} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity
        testID={`delete-item-${index}`}
        onPress={onDelete}
        className="rounded-full bg-red-100 p-2"
        hitSlop={8}
      >
        <Ionicons name="trash-outline" size={16} color="#DC2626" />
      </TouchableOpacity>
    </View>
  );
}

function ItemDetails({
  item,
  itemTotal,
}: {
  item: GroceryItem;
  itemTotal: number;
}) {
  return (
    <View className="ml-3 flex-1">
      <Text
        className={`text-base font-medium ${item.isChecked ? 'text-gray-500' : 'text-gray-800'}`}
        style={
          item.isChecked ? { textDecorationLine: 'line-through' } : undefined
        }
      >
        {item.name}
      </Text>
      <View className="mt-1 flex-row items-center">
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-500">Qty: {item.quantity}</Text>

          {item.price && (
            <>
              <Text className="mx-1 text-gray-400">•</Text>
              <Text className="text-sm text-gray-500">${item.price}</Text>
            </>
          )}
        </View>

        {item.price && (
          <View className="ml-2 rounded-md bg-gray-100 px-2 py-0.5">
            <Text className="text-sm font-medium text-gray-700">
              ${formatPrice(itemTotal)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function GroceryItemComponent({
  item,
  onToggle,
  onEdit,
  onDelete,
  index,
}: {
  item: GroceryItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  const itemTotal = calculateItemTotal(item);

  return (
    <View
      className={`flex-row items-center justify-between p-4 ${item.isChecked ? 'bg-gray-50' : 'bg-white'}`}
    >
      <View className="flex-1 flex-row items-center">
        <TouchableOpacity testID={`toggle-item-${index}`} onPress={onToggle}>
          <Checkbox
            checked={item.isChecked}
            onChange={onToggle}
            accessibilityLabel={`Toggle ${item.name}`}
          />
        </TouchableOpacity>
        <ItemDetails item={item} itemTotal={itemTotal} />
      </View>
      <ItemActions onEdit={onEdit} onDelete={onDelete} index={index} />
    </View>
  );
}

function MonthSearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (text: string) => void;
}) {
  return (
    <View className="mb-4 rounded-lg border border-gray-200 bg-white p-2">
      <View className="flex-row items-center">
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          className="ml-2 flex-1 text-base"
          placeholder="Search months..."
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function MonthOption({
  month,
  selectedMonth,
  onSelect,
  onSetDefault,
  isDefault,
}: {
  month: string;
  selectedMonth: string;
  onSelect: (month: string) => void;
  onSetDefault: (month: string) => void;
  isDefault: boolean;
}) {
  const isSelected = selectedMonth === month;

  return (
    <View className="mb-2">
      <TouchableOpacity
        onPress={() => onSelect(month)}
        className={`flex-row items-center justify-between rounded-lg ${
          isSelected ? 'border border-primary-200 bg-primary-50' : 'bg-gray-50'
        } p-3`}
      >
        <View className="flex-row items-center gap-2">
          <Text
            className={`text-base ${isSelected ? 'font-bold text-primary-600' : ''}`}
          >
            {month}
          </Text>
          {isSelected && (
            <View className="ml-2">
              <Ionicons name="checkmark-circle" size={18} color="#10b981" />
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => onSetDefault(month)}
          className="ml-2 rounded-full p-2"
          hitSlop={8}
        >
          <Ionicons
            name={isDefault ? 'star' : 'star-outline'}
            size={18}
            color={isDefault ? '#f59e0b' : '#666'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

function MonthSelectorContent({
  search,
  setSearch,
  sortedMonths,
  selectedMonth,
  defaultMonth,
  handleSelectMonth,
  handleSetDefault,
  onAddNewMonth,
}: {
  search: string;
  setSearch: (text: string) => void;
  sortedMonths: string[];
  selectedMonth: string;
  defaultMonth: string | null;
  handleSelectMonth: (month: string) => void;
  handleSetDefault: (month: string) => void;
  onAddNewMonth: () => void;
}) {
  return (
    <View className="flex-1 p-4">
      <MonthSearchBar search={search} setSearch={setSearch} />

      <View className="mb-4 rounded-lg bg-gray-50 p-3">
        <Text className="text-xs text-gray-500">
          • Selected month (
          <Ionicons name="checkmark-circle" size={12} color="#10b981" />) is
          currently being viewed
        </Text>
        <Text className="text-xs text-gray-500">
          • Default month (<Ionicons name="star" size={12} color="#f59e0b" />)
          will be loaded when you open the app
        </Text>
      </View>

      <ScrollView className="mb-4 flex-1">
        {sortedMonths.length > 0 ? (
          sortedMonths.map((month) => (
            <MonthOption
              key={month}
              month={month}
              selectedMonth={selectedMonth}
              onSelect={handleSelectMonth}
              onSetDefault={handleSetDefault}
              isDefault={month === defaultMonth}
            />
          ))
        ) : (
          <View className="items-center py-8">
            <Text className="text-gray-500">No months found</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        onPress={onAddNewMonth}
        className="rounded-lg bg-primary-500 py-3"
      >
        <Text className="text-center font-medium text-white">
          Add New Month
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function MonthSelectorSheet({
  isVisible,
  onClose,
  onSelect,
  selectedMonth,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (month: string) => void;
  selectedMonth: string;
}) {
  const { ref, present, dismiss } = useModal();
  const [isAddMonthModalOpen, setIsAddMonthModalOpen] = useState(false);
  const {
    search,
    setSearch,
    sortedMonths,
    defaultMonth,
    handleSetDefault,
    handleSelectMonth,
  } = useMonthSelector(selectedMonth, onSelect, onClose);

  // Control visibility
  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  return (
    <>
      <Modal
        ref={ref}
        onDismiss={onClose}
        snapPoints={['70%']}
        title="Select Month"
      >
        <MonthSelectorContent
          search={search}
          setSearch={setSearch}
          sortedMonths={sortedMonths}
          selectedMonth={selectedMonth}
          defaultMonth={defaultMonth}
          handleSelectMonth={handleSelectMonth}
          handleSetDefault={handleSetDefault}
          onAddNewMonth={() => setIsAddMonthModalOpen(true)}
        />
      </Modal>

      <AddMonthModal
        isVisible={isAddMonthModalOpen}
        onClose={() => setIsAddMonthModalOpen(false)}
        onAddMonth={(month) => {
          handleSelectMonth(month);
          setIsAddMonthModalOpen(false);
        }}
        existingMonths={sortedMonths}
      />
    </>
  );
}

function MonthSelect({
  months,
  selectedMonth,
  onSelectMonth,
  currentMonth,
}: {
  months: string[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
  currentMonth: string;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        Select Month
      </Text>
      <View className="flex-row flex-wrap">
        {months.map((month) => {
          const isSelected = selectedMonth === month;
          const isCurrent = currentMonth === month;
          return (
            <TouchableOpacity
              key={month}
              onPress={() => onSelectMonth(month)}
              className={`m-1 rounded-lg px-3 py-2 ${
                isSelected
                  ? 'bg-primary-500'
                  : isCurrent
                    ? 'bg-green-500'
                    : 'bg-gray-100'
              }`}
            >
              <Text
                className={
                  isSelected || isCurrent ? 'text-white' : 'text-gray-800'
                }
              >
                {month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function YearSelect({
  years,
  selectedYear,
  onSelectYear,
}: {
  years: string[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
}) {
  return (
    <View className="mb-6">
      <Text className="mb-2 text-sm font-medium text-gray-700">
        Select Year
      </Text>
      <View className="flex-row flex-wrap">
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() => onSelectYear(year)}
            className={`m-1 rounded-lg px-4 py-2 ${
              selectedYear === year ? 'bg-primary-500' : 'bg-gray-100'
            }`}
          >
            <Text
              className={selectedYear === year ? 'text-white' : 'text-gray-800'}
            >
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function MonthExistsError({ monthName }: { monthName: string }) {
  return (
    <View className="mb-4 rounded-lg bg-red-50 p-3">
      <Text className="text-center text-red-600">
        "{monthName}" already exists in your grocery list
      </Text>
    </View>
  );
}

function useMonthYearSelector(existingMonths: string[]) {
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    MONTHS[new Date().getMonth()]
  );
  const currentMonth = MONTHS[new Date().getMonth()];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() + i).toString()
  );

  const fullMonthString = `${selectedMonth} ${selectedYear}`;
  const monthExists = existingMonths.includes(fullMonthString);

  return {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentMonth,
    years,
    fullMonthString,
    monthExists,
  };
}

function AddMonthModalContent({
  selectedMonth,
  selectedYear,
  currentMonth,
  years,
  monthExists,
  fullMonthString,
  onSelectMonth,
  onSelectYear,
  onAddMonth,
}: {
  selectedMonth: string;
  selectedYear: string;
  currentMonth: string;
  years: string[];
  monthExists: boolean;
  fullMonthString: string;
  onSelectMonth: (month: string) => void;
  onSelectYear: (year: string) => void;
  onAddMonth: () => void;
}) {
  return (
    <View className="flex-1 p-4">
      <MonthSelect
        months={MONTHS}
        selectedMonth={selectedMonth}
        onSelectMonth={onSelectMonth}
        currentMonth={currentMonth}
      />

      <YearSelect
        years={years}
        selectedYear={selectedYear}
        onSelectYear={onSelectYear}
      />

      {monthExists && <MonthExistsError monthName={fullMonthString} />}

      <View className="mt-6">
        <Button
          onPress={onAddMonth}
          className={`h-[44px] rounded-xl ${
            monthExists ? 'bg-gray-400' : 'bg-primary-500'
          }`}
          label={`Add ${selectedMonth} ${selectedYear}`}
          disabled={monthExists}
        />
      </View>
    </View>
  );
}

function AddMonthModal({
  isVisible,
  onClose,
  onAddMonth,
  existingMonths,
}: {
  isVisible: boolean;
  onClose: () => void;
  onAddMonth: (month: string) => void;
  existingMonths: string[];
}) {
  const { ref, present, dismiss } = useModal();
  const {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    currentMonth,
    years,
    fullMonthString,
    monthExists,
  } = useMonthYearSelector(existingMonths);

  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  const handleAddMonth = () => {
    if (!monthExists) {
      onAddMonth(fullMonthString);
    }
  };

  return (
    <Modal
      ref={ref}
      onDismiss={onClose}
      snapPoints={['55%']}
      title="Add New Month"
    >
      <AddMonthModalContent
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        currentMonth={currentMonth}
        years={years}
        monthExists={monthExists}
        fullMonthString={fullMonthString}
        onSelectMonth={setSelectedMonth}
        onSelectYear={setSelectedYear}
        onAddMonth={handleAddMonth}
      />
    </Modal>
  );
}

function useMonthSelector(
  selectedMonth: string,
  onSelect: (month: string) => void,
  onClose: () => void
) {
  const [search, setSearch] = useState('');
  const [customMonths, setCustomMonths] = useState<string[]>([]);
  const [defaultMonth, setDefaultMonth] = useState<string | null>(null);

  // Combine default and custom months
  const allMonths = [...DEFAULT_MONTHS, ...customMonths];

  // Filter months based on search
  const filteredMonths = search.trim()
    ? allMonths.filter((month) =>
        month.toLowerCase().includes(search.toLowerCase())
      )
    : allMonths;

  // Sort to put selected month first, then default month
  const sortedMonths = [...filteredMonths].sort((a, b) => {
    if (a === selectedMonth) return -1;
    if (b === selectedMonth) return 1;
    if (a === defaultMonth) return -1;
    if (b === defaultMonth) return 1;
    return 0;
  });

  const handleSetDefault = (month: string) => {
    // Toggle default - if already default, unset it
    if (defaultMonth === month) {
      setDefaultMonth(null);
    } else {
      setDefaultMonth(month);
      // In a real app, this would also save to storage
      console.log('Setting default month:', month);
    }
  };

  const handleSelectMonth = (month: string) => {
    // Add to custom months if not already in default or custom months
    if (!allMonths.includes(month)) {
      setCustomMonths((prev) => [...prev, month]);
    }
    onSelect(month);
    onClose();
  };

  return {
    search,
    setSearch,
    sortedMonths,
    defaultMonth,
    handleSetDefault,
    handleSelectMonth,
  };
}

function GrocerySummary({ items }: { items: GroceryItem[] }) {
  const totalPrice = calculateTotal(items);
  const totalItems = items.length;
  const completedItems = items.filter((item) => item.isChecked).length;
  const percentComplete =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <View className="mb-6 mt-2 rounded-xl bg-primary-50 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-medium text-primary-700">Items</Text>
          <Text className="text-xl font-bold text-primary-800">
            {completedItems}/{totalItems}
          </Text>
        </View>

        <View>
          <Text className="text-sm font-medium text-primary-700">Total</Text>
          <Text className="text-xl font-bold text-primary-800">
            ${totalPrice}
          </Text>
        </View>

        <View>
          <Text className="text-sm font-medium text-primary-700">Progress</Text>
          <Text className="text-xl font-bold text-primary-800">
            {percentComplete}%
          </Text>
        </View>
      </View>

      <View className="mt-3">
        <View className="h-2 overflow-hidden rounded-full bg-primary-100">
          <View
            className="h-full bg-primary-500"
            style={{ width: `${percentComplete}%` }}
          />
        </View>
      </View>
    </View>
  );
}

function CategoryGroup({
  category,
  items,
  onToggle,
  onEdit,
  onDelete,
}: {
  category: string;
  items: GroceryItem[];
  onToggle: (id: string) => void;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
}) {
  const totalPrice = calculateTotal(items);
  const checkedItems = items.filter((item) => item.isChecked).length;

  return (
    <View className="mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <View className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-medium text-gray-800">{category}</Text>
          <View className="flex-row items-center space-x-2">
            <View className="rounded-full bg-gray-100 px-2 py-1">
              <Text className="text-sm text-gray-600">
                {checkedItems}/{items.length}
              </Text>
            </View>
            {totalPrice !== '0.00' && (
              <View className="rounded-full bg-primary-50 px-2 py-1">
                <Text className="text-sm font-medium text-primary-700">
                  ${totalPrice}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <GroceryItemComponent
            key={item.id}
            item={item}
            index={index}
            onToggle={() => onToggle(item.id)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item.id)}
          />
        ))}
      </View>
    </View>
  );
}

function FormInput({
  label,
  ...props
}: {
  label: string;
} & React.ComponentProps<typeof TextInput>) {
  return (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput {...props} className="rounded-lg border border-gray-300 p-4" />
    </View>
  );
}

function CategorySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (category: string) => void;
}) {
  const categoryOptions = CATEGORIES.map((category) => ({
    label: category.name,
    value: category.name,
  }));

  const handleSelect = (selectedValue: string | number) => {
    onChange(String(selectedValue));
  };

  return (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700">Category</Text>
      <Select options={categoryOptions} value={value} onSelect={handleSelect} />
    </View>
  );
}

function FormFields({
  name,
  quantity,
  price,
  category,
  onChangeName,
  onChangeQuantity,
  onChangePrice,
  onChangeCategory,
}: {
  name: string;
  quantity: string;
  price: string;
  category: string;
  onChangeName: (text: string) => void;
  onChangeQuantity: (text: string) => void;
  onChangePrice: (text: string) => void;
  onChangeCategory: (category: string) => void;
}) {
  return (
    <View className="flex gap-5">
      <FormInput
        label="Item Name"
        placeholder="Item name"
        value={name}
        onChangeText={onChangeName}
      />
      <FormInput
        label="Quantity"
        placeholder="Quantity"
        value={quantity}
        onChangeText={onChangeQuantity}
        keyboardType="numeric"
      />
      <FormInput
        label="Price (Optional)"
        placeholder="Price (optional)"
        value={price}
        onChangeText={onChangePrice}
        keyboardType="decimal-pad"
      />
      <CategorySelect value={category} onChange={onChangeCategory} />
    </View>
  );
}

function FormActions({
  onSubmit,
  isEditing,
}: {
  onSubmit: () => void;
  isEditing: boolean;
}) {
  return (
    <View className="mt-6">
      <Button
        testID="submit-form-button"
        onPress={onSubmit}
        className="h-[44px] rounded-xl bg-primary-500"
        label={isEditing ? 'Update Item' : 'Add Item'}
      />
    </View>
  );
}

function GroceryFormContent({
  name,
  quantity,
  price,
  category,
  isEditing,
  onChangeName,
  onChangeQuantity,
  onChangePrice,
  onChangeCategory,
  onSubmit,
}: {
  name: string;
  quantity: string;
  price: string;
  category: string;
  isEditing: boolean;
  onChangeName: (text: string) => void;
  onChangeQuantity: (text: string) => void;
  onChangePrice: (text: string) => void;
  onChangeCategory: (category: string) => void;
  onSubmit: () => void;
}) {
  return (
    <View className="flex-1 px-4">
      <FormFields
        name={name}
        quantity={quantity}
        price={price}
        category={category}
        onChangeName={onChangeName}
        onChangeQuantity={onChangeQuantity}
        onChangePrice={onChangePrice}
        onChangeCategory={onChangeCategory}
      />

      <FormActions onSubmit={onSubmit} isEditing={isEditing} />
    </View>
  );
}

function useGroceryForm(initialItem?: GroceryItem, isEditing = false) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (isEditing && initialItem) {
      setName(initialItem.name);
      setQuantity(initialItem.quantity);
      setPrice(initialItem.price || '');
      setCategory(initialItem.category);
    } else {
      setName('');
      setQuantity('');
      setPrice('');
      setCategory('');
    }
  }, [isEditing, initialItem]);

  return {
    name,
    setName,
    quantity,
    setQuantity,
    price,
    setPrice,
    category,
    setCategory,
  };
}

function GroceryFormSheet({
  isVisible,
  onClose,
  onSubmit,
  initialItem,
  isEditing,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<GroceryItem, 'id' | 'isChecked' | 'date'>) => void;
  initialItem?: GroceryItem;
  isEditing: boolean;
}) {
  const { ref, present, dismiss } = useModal();
  const {
    name,
    setName,
    quantity,
    setQuantity,
    price,
    setPrice,
    category,
    setCategory,
  } = useGroceryForm(initialItem, isEditing);

  useEffect(() => {
    if (isVisible) {
      present();
    } else {
      dismiss();
    }
  }, [isVisible, present, dismiss]);

  const handleSubmit = () => {
    onSubmit({
      name,
      quantity,
      price,
      category,
    });
    onClose();
  };

  return (
    <Modal
      ref={ref}
      onDismiss={onClose}
      snapPoints={['60%']}
      title={isEditing ? 'Edit Grocery Item' : 'Add Grocery Item'}
    >
      <GroceryFormContent
        name={name}
        quantity={quantity}
        price={price}
        category={category}
        isEditing={isEditing}
        onChangeName={setName}
        onChangeQuantity={setQuantity}
        onChangePrice={setPrice}
        onChangeCategory={setCategory}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

function useGroceryItems() {
  const [items, setItems] = useState<GroceryItem[]>(INITIAL_ITEMS);

  const handleAddItem = useCallback(
    (newItem: Omit<GroceryItem, 'id' | 'isChecked' | 'date'>) => {
      setItems((prev) => [
        ...prev,
        {
          ...newItem,
          id: Math.random().toString(),
          isChecked: false,
          date: formatDate(new Date()),
        },
      ]);
    },
    []
  );

  const handleEditItem = useCallback(
    (
      editingItem: GroceryItem,
      updatedItem: Omit<GroceryItem, 'id' | 'isChecked' | 'date'>
    ) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...updatedItem,
                date: item.date, // Preserve the original date
              }
            : item
        )
      );
    },
    []
  );

  const handleDeleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleToggleItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isChecked: !item.isChecked,
            }
          : item
      )
    );
  }, []);

  return {
    items,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
  };
}

// Add helper functions for date handling
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMonthFromDate(dateString: string): string {
  const date = new Date(dateString);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function isSameMonth(dateString: string, selectedMonth: string): boolean {
  return getMonthFromDate(dateString) === selectedMonth;
}

// Add EmptyState component after the GrocerySummary component
function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-4 pb-20">
      <View className="mb-6">
        <Svg width={200} height={200} viewBox="0 0 200 200" fill="none">
          <Path
            d="M100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20ZM100 160C66.8629 160 40 133.137 40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100C160 133.137 133.137 160 100 160Z"
            fill="#E5E7EB"
          />
          <Path
            d="M100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60ZM100 120C88.9543 120 80 111.046 80 100C80 88.9543 88.9543 80 100 80C111.046 80 120 88.9543 120 100C120 111.046 111.046 120 100 120Z"
            fill="#D1D5DB"
          />
          <Path
            d="M100 80C88.9543 80 80 88.9543 80 100C80 111.046 88.9543 120 100 120C111.046 120 120 111.046 120 100C120 88.9543 111.046 80 100 80ZM100 100C100 100 100 100 100 100C100 100 100 100 100 100C100 100 100 100 100 100Z"
            fill="#9CA3AF"
          />
        </Svg>
      </View>
      <Text className="mb-2 text-center text-xl font-semibold text-gray-900">
        No Groceries Yet
      </Text>
      <Text className="text-center text-gray-500">
        Add your first grocery item to get started
      </Text>
    </View>
  );
}

// Update GroceryContent to show EmptyState when there are no items
function GroceryContent({
  itemsByCategory,
  onToggle,
  onEdit,
  onDelete,
  selectedMonth,
}: {
  itemsByCategory: Record<string, GroceryItem[]>;
  onToggle: (id: string) => void;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
  selectedMonth: string;
}) {
  // Filter items by selected month
  const filteredItemsByCategory = Object.entries(itemsByCategory).reduce<
    Record<string, GroceryItem[]>
  >((acc, [category, items]) => {
    const filteredItems = items.filter((item) =>
      isSameMonth(item.date, selectedMonth)
    );
    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }
    return acc;
  }, {});

  const allItems = Object.values(filteredItemsByCategory).flat();

  if (allItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <ScrollView className="flex-1">
      <View className="px-4">
        <GrocerySummary items={allItems} />

        {Object.entries(filteredItemsByCategory).map(
          ([category, categoryItems]) => (
            <CategoryGroup
              key={category}
              category={category}
              items={categoryItems}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )
        )}
      </View>
    </ScrollView>
  );
}

// Extract modal rendering to reduce main component line count
function GroceryModals({
  isFormOpen,
  isMonthSelectorOpen,
  editingItem,
  selectedMonth,
  onFormClose,
  onMonthSelectorClose,
  onSubmit,
  onSelectMonth,
}: {
  isFormOpen: boolean;
  isMonthSelectorOpen: boolean;
  editingItem: GroceryItem | undefined;
  selectedMonth: string;
  onFormClose: () => void;
  onMonthSelectorClose: () => void;
  onSubmit: (item: Omit<GroceryItem, 'id' | 'isChecked' | 'date'>) => void;
  onSelectMonth: (month: string) => void;
}) {
  return (
    <>
      <GroceryFormSheet
        isVisible={isFormOpen}
        onClose={onFormClose}
        onSubmit={onSubmit}
        initialItem={editingItem}
        isEditing={!!editingItem}
      />

      <MonthSelectorSheet
        isVisible={isMonthSelectorOpen}
        onClose={onMonthSelectorClose}
        onSelect={onSelectMonth}
        selectedMonth={selectedMonth}
      />
    </>
  );
}

// eslint-disable-next-line max-lines-per-function
export default function Groceries() {
  const {
    items,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleToggleItem,
  } = useGroceryItems();

  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GroceryItem | undefined>();

  const itemsByCategory = items.reduce<Record<string, GroceryItem[]>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  const handleEdit = useCallback((item: GroceryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  }, []);

  const handleSubmit = useCallback(
    (item: Omit<GroceryItem, 'id' | 'isChecked' | 'date'>) => {
      if (editingItem) {
        handleEditItem(editingItem, item);
      } else {
        handleAddItem(item);
      }
    },
    [editingItem, handleAddItem, handleEditItem]
  );

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      {/* Fixed header section */}
      <View className="bg-white">
        <Header />
        <MonthSelector
          selectedMonth={selectedMonth}
          onPress={() => setIsMonthSelectorOpen(true)}
        />
        <AddItemButton onPress={() => setIsFormOpen(true)} />
      </View>

      {/* Scrollable content */}
      <GroceryContent
        itemsByCategory={itemsByCategory}
        onToggle={handleToggleItem}
        onEdit={handleEdit}
        onDelete={handleDeleteItem}
        selectedMonth={selectedMonth}
      />

      <GroceryModals
        isFormOpen={isFormOpen}
        isMonthSelectorOpen={isMonthSelectorOpen}
        editingItem={editingItem}
        selectedMonth={selectedMonth}
        onFormClose={handleFormClose}
        onMonthSelectorClose={() => setIsMonthSelectorOpen(false)}
        onSubmit={handleSubmit}
        onSelectMonth={setSelectedMonth}
      />
    </View>
  );
}
