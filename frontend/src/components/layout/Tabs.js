import { useState } from 'react';

const Tabs = ({ tabNames, tabContent }) => {
    const [openTab, setOpenTab] = useState(1);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    <ul
                        className="flex flex-row flex-wrap pt-3 pb-4 mb-0 list-none"
                        role="tablist"
                    >
                        {tabNames.map((tab, index) => {
                            return (
                                <li
                                    className="flex-auto mr-2 -mb-px text-center last:mr-0"
                                    key={`${tab}-${index}`}
                                >
                                    <a
                                        className={
                                            'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                                            (openTab === index
                                                ? 'text-white purple-blue-gradient'
                                                : 'text-purple-600 bg-white')
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setOpenTab(index);
                                        }}
                                        data-toggle="tab"
                                        href={`#${tab}`}
                                        role="tablist"
                                    >
                                        {tab}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="relative flex flex-col w-full min-w-0 mb-6 break-words bg-white rounded shadow-lg">
                        <div className="flex-auto px-4 py-5">
                            <div className="tab-content tab-space">
                                {tabContent.map((content, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className={
                                                openTab === index
                                                    ? 'block'
                                                    : 'hidden'
                                            }
                                            id={tabNames[index]}
                                        >
                                            {content}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Tabs;
