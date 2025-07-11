/**
 * @package: 	WeCodeArt SmoothScroll Admin
 * @author: 	Bican Marian Valeriu
 * @license:	https://www.wecodeart.com/
 * @version:	1.0.0
 */

const {
    i18n: {
        __,
    },
    hooks: {
        addFilter
    },
    components: {
        Placeholder,
        Card,
        CardHeader,
        CardBody,
        Spinner,
        Button,
        TextControl,
        BaseControl,
        RangeControl,
        SelectControl,
        ToggleControl,
        __experimentalHStack: HStack,
        __experimentalVStack: VStack,
        __experimentalNumberControl: NumberControl,
    },
    element: {
        useState,
    },
    blockEditor: {
        useSetting
    },
} = wp;

addFilter('wecodeart.admin.tabs.plugins', 'wecodeart/smoothscroll/admin/panel', optionsPanel);
function optionsPanel(panels) {
    return [...panels, {
        name: 'wca-smoothscroll',
        title: __('Smooth Scroll', 'wecodeart'),
        render: (props) => <Options {...props} />
    }];
}

const Options = (props) => {
    const { settings, saveSettings, isRequesting, createNotice } = props;

    if (isRequesting || !settings) {
        return <Placeholder {...{
            icon: <Spinner />,
            label: __('Loading', 'wecodeart'),
            instructions: __('Please wait, loading settings...', 'wecodeart')
        }} />;
    }

    const apiOptions = (({ smoothscroll }) => (smoothscroll))(settings);
    const [loading, setLoading] = useState(null);
    const [formData, setFormData] = useState(apiOptions);

    const handleSave = async () => {
        setLoading(true);
        
        try {
            await saveSettings({ smoothscroll: formData });
            createNotice('success', __('Smooth scroll settings saved successfully.', 'wecodeart'));
        } catch (error) {
            createNotice('error', __('Failed to save settings.', 'wecodeart'));
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData(apiOptions);
        createNotice('info', __('Settings reset.', 'wecodeart'));
    };

    const updateConfig = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <div className="grid" style={{ '--wca--columns': 2 }}>
                <div className="g-col-1">
                    <Card className="border shadow-none">
                        <CardHeader>
                            <h5 className="text-uppercase fw-medium m-0">{__('Core Settings', 'wecodeart')}</h5>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4}>
                                <NumberControl
                                    label={__('Frame Rate', 'wecodeart')}
                                    value={formData?.frameRate || 150}
                                    onChange={value => updateConfig('frameRate', parseInt(value))}
                                    min={30}
                                    max={300}
                                    step={10}
                                    help={__('Animation frame rate (30-300). Higher values = smoother animation.', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Animation Duration', 'wecodeart')}
                                    value={formData?.animationTime || 1000}
                                    onChange={value => updateConfig('animationTime', parseInt(value))}
                                    min={100}
                                    max={5000}
                                    step={100}
                                    help={__('Duration of scroll animations in milliseconds.', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Step Size', 'wecodeart')}
                                    value={formData?.stepSize || 100}
                                    onChange={value => updateConfig('stepSize', parseInt(value))}
                                    min={10}
                                    max={500}
                                    step={10}
                                    help={__('Scroll step size in pixels.', 'wecodeart')}
                                />
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card className="border shadow-none mt-4">
                        <CardHeader>
                            <h5 className="text-uppercase fw-medium m-0">{__('Pulse Settings', 'wecodeart')}</h5>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4}>
                                <ToggleControl
                                    label={__('Enable Pulse Algorithm', 'wecodeart')}
                                    checked={formData?.pulseAlgorithm !== false}
                                    onChange={value => updateConfig('pulseAlgorithm', value)}
                                    help={__('Use pulse algorithm for smoother acceleration.', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Pulse Scale', 'wecodeart')}
                                    value={formData?.pulseScale || 4}
                                    onChange={value => updateConfig('pulseScale', parseInt(value))}
                                    min={1}
                                    max={10}
                                    step={1}
                                    help={__('Pulse algorithm scale factor.', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Pulse Normalize', 'wecodeart')}
                                    value={formData?.pulseNormalize || 1}
                                    onChange={value => updateConfig('pulseNormalize', parseInt(value))}
                                    min={1}
                                    max={10}
                                    step={1}
                                    help={__('Pulse algorithm normalization factor.', 'wecodeart')}
                                />
                            </VStack>
                        </CardBody>
                    </Card>
                </div>
                <div className="g-col-1">
                    <Card className="border shadow-none">
                        <CardHeader>
                            <h5 className="text-uppercase fw-medium m-0">{__('Acceleration Settings', 'wecodeart')}</h5>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4}>
                                <NumberControl
                                    label={__('Acceleration Delta', 'wecodeart')}
                                    value={formData?.accelerationDelta || 50}
                                    onChange={value => updateConfig('accelerationDelta', parseInt(value))}
                                    min={10}
                                    max={200}
                                    step={10}
                                    help={__('Acceleration delta for scroll speed changes.', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Acceleration Max', 'wecodeart')}
                                    value={formData?.accelerationMax || 3}
                                    onChange={value => updateConfig('accelerationMax', parseInt(value))}
                                    min={1}
                                    max={10}
                                    step={1}
                                    help={__('Maximum acceleration multiplier.', 'wecodeart')}
                                />
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card className="border shadow-none mt-4">
                        <CardHeader>
                            <h5 className="text-uppercase fw-medium m-0">{__('Keyboard Settings', 'wecodeart')}</h5>
                        </CardHeader>
                        <CardBody>
                            <VStack spacing={4}>
                                <ToggleControl
                                    label={__('Enable Keyboard Support', 'wecodeart')}
                                    checked={formData?.keyboardSupport !== false}
                                    onChange={value => updateConfig('keyboardSupport', value)}
                                    help={__('Enable keyboard navigation (arrow keys, space, page up/down).', 'wecodeart')}
                                />

                                <NumberControl
                                    label={__('Arrow Scroll Distance', 'wecodeart')}
                                    value={formData?.arrowScroll || 50}
                                    onChange={value => updateConfig('arrowScroll', parseInt(value))}
                                    min={10}
                                    max={200}
                                    step={10}
                                    help={__('Distance to scroll with arrow keys in pixels.', 'wecodeart')}
                                />
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card className="border shadow-none mt-4">
                        <CardHeader>
                            <h5 className="text-uppercase fw-medium m-0">{__('Page Exclusions', 'wecodeart')}</h5>
                        </CardHeader>
                        <CardBody> 
                            <TextControl
                                label={__('Exclude Pages', 'wecodeart')}
                                value={formData?.excludeIds || ''}
                                onChange={value => updateConfig('excludeIds', value)}
                                placeholder={__('e.g., 1, 5, 10, 25', 'wecodeart')}
                                help={__('Enter object IDs separated by commas to exclude them from smooth scrolling.', 'wecodeart')}
                            /> 
                        </CardBody>
                    </Card>
                </div>
            </div>
            <hr style={{ margin: '20px 0' }} />
            <HStack spacing={3} style={{ justifyContent: 'flex-end' }}>
                <Button
                    isSecondary
                    onClick={handleReset}
                    disabled={loading}
                >
                    {__('Reset Settings', 'wecodeart')}
                </Button>
                
                <Button
                    isPrimary
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? <Spinner /> : __('Save Settings', 'wecodeart')}
                </Button>
            </HStack>
        </>
    );
}; 