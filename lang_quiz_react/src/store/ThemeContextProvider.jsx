// Page theme selector using the shared and centrally managed context
import {createContext, useState} from 'react';

const defaultTheme = "dark"; 

// Context shared between the components by the import
export const ThemeContext = createContext({ theme: defaultTheme, changeTheme: () => {} }); 

// Component for wrapping other component that should use the useContext hook and be re-rendered
export default function ThemeContextProvider({children}) {
    const [pageTheme, setPageTheme] = useState(defaultTheme);   // Theme designation
     
    const changePageTheme = () => {
        setPageTheme((prevTheme) => {return prevTheme === "dark" ? "light" : "dark"});
    }

    return(
        // Note below how the values are packed with different names! They can auto-populated if they are similar!
        <ThemeContext.Provider value={{theme: pageTheme, changeTheme: changePageTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}
