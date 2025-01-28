import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ThemeColors {
  id: number;
  themeName: string;
  menuBg: string;
  // menuBgHover: string;
  // subMenuBg: string;
  // menuFont: string;
  // menuFontHover: string;
}

function Settings() {
  const [theme, setTheme] = useState<ThemeColors>({
    id: 1,
    themeName: 'Default',
    menuBg: '#CC3333',
    // menuBgHover: '#9C6A98',
    // subMenuBg: '#666666',
    // menuFont: '#F0F0F0',
    // menuFontHover: '#E1A1E3'
  });

  const [themes, setThemes] = useState<ThemeColors[]>([
    { id: 1, themeName: "Default", menuBg: "#CC3333" },
    { id: 2, themeName: "Theme-1", menuBg: "#33CCCC" },
    { id: 3, themeName: "Theme-2", menuBg: "#000000" },
    { id: 4, themeName: "Theme-3", menuBg: "#33CCCC" },
    { id: 5, themeName: "Theme-4", menuBg: "#3E1254" },
    { id: 6, themeName: "Theme-5", menuBg: "#3E1254" },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTheme(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (theme: ThemeColors) => {
    setThemes((prevThemes) =>
      prevThemes.map((t) =>
        t.id === theme.id
          ? { ...t, themeName: theme.themeName, menuBg: theme.menuBg } // Update the matching theme
          : t // Keep other themes unchanged
      )
    );
  };

  const handleThemeSelect = (themeId: number) => {
    const selectedTheme = themes.find(t => t.id === themeId);

    if (selectedTheme) {
      setTheme({
        id: selectedTheme.id,
        themeName: selectedTheme.themeName,
        menuBg: selectedTheme.menuBg
      });
    }
  };

  return (
    <div className=" bg-gray-100 p-6">
      <div className="max-w-xl space-y-8">
        {/* Color Picker Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="w-64 text-gray-600">Theme Name</label>
              <input
                type="text"
                name="themeName"
                value={theme.themeName}
                onChange={handleChange}
                className="flex-1 border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-64 text-gray-600">Background Color</label>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="color"
                  name="menuBg"
                  value={theme.menuBg}
                  onChange={handleChange}
                  className="w-16 h-8"
                />
                <input
                  type="text"
                  value={theme.menuBg}
                  onChange={handleChange}
                  name="menuBg"
                  className="flex-1 border rounded px-3 py-2 uppercase"
                />
              </div>
            </div>

            {/* <div className="flex items-center gap-4">
                            <label className="w-64 text-gray-600">Menu Background Color on Hover</label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="color"
                                    name="menuBgHover"
                                    value={theme.menuBgHover}
                                    onChange={handleChange}
                                    className="w-16 h-8"
                                />
                                <input
                                    type="text"
                                    value={theme.menuBgHover}
                                    onChange={handleChange}
                                    name="menuBgHover"
                                    className="flex-1 border rounded px-3 py-2 uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-64 text-gray-600">Sub-Menu Background Color</label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="color"
                                    name="subMenuBg"
                                    value={theme.subMenuBg}
                                    onChange={handleChange}
                                    className="w-16 h-8"
                                />
                                <input
                                    type="text"
                                    value={theme.subMenuBg}
                                    onChange={handleChange}
                                    name="subMenuBg"
                                    className="flex-1 border rounded px-3 py-2 uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-64 text-gray-600">Menu Font Color</label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="color"
                                    name="menuFont"
                                    value={theme.menuFont}
                                    onChange={handleChange}
                                    className="w-16 h-8"
                                />
                                <input
                                    type="text"
                                    value={theme.menuFont}
                                    onChange={handleChange}
                                    name="menuFont"
                                    className="flex-1 border rounded px-3 py-2 uppercase"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="w-64 text-gray-600">Menu Font Color on Hover</label>
                            <div className="flex-1 flex items-center gap-2">
                                <input
                                    type="color"
                                    name="menuFontHover"
                                    value={theme.menuFontHover}
                                    onChange={handleChange}
                                    className="w-16 h-8"
                                />
                                <input
                                    type="text"
                                    value={theme.menuFontHover}
                                    onChange={handleChange}
                                    name="menuFontHover"
                                    className="flex-1 border rounded px-3 py-2 uppercase"
                                />
                            </div>
                        </div> */}

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => handleSubmit(theme)}
                className="px-6 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors"
              >
                Update
              </button>
              {/* <button
                onClick={() => handleSubmit('saveAs')}
                className="px-6 py-2 bg-purple-900 text-white rounded hover:bg-purple-800 transition-colors"
              >
                Save As
              </button> */}
            </div>
          </div>
        </div>

        {/* Available Themes Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Available Themes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map((presetTheme) => (
              <div
                key={presetTheme.themeName}
                className="bg-gray-50 p-4 rounded-lg relative cursor-pointer"
                onClick={() => handleThemeSelect(presetTheme.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name="selectedTheme"
                    checked={theme.themeName === presetTheme.themeName}
                    onChange={() => handleThemeSelect(presetTheme.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">{presetTheme.themeName}</span>
                </div>
                <div className="flex gap-1">
                  {/* {presetTheme.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-32 h-8"
                      style={{ backgroundColor: color }}
                    />
                  ))} */}
                  <div style={{ backgroundColor: presetTheme.menuBg }} className="w-32 h-8">

                  </div>

                </div>
                {/* {presetTheme.isRemovable && (
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                    <X size={16} />
                  </button>
                )} */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;